import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
      isProfileComplete?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
    isProfileComplete?: boolean
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // ─── Admin Credentials (UNCHANGED) ──────────────────────────────────────
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminEmail || !adminPassword) return null
        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return { id: "admin", email: adminEmail, name: "Admin", role: "admin" }
        }
        return null
      },
    }),

    // ─── Customer Email + Password ──────────────────────────────────────────
    Credentials({
      id: "user-credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.password) return null
        if (user.role === "admin") return null // Separate flows
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isProfileComplete: (user as any).isProfileComplete,
        }
      },
    }),

    // ─── Customer OTP (Email-based Mobile replacement logic) ───────────────
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null
        const email = credentials.email as string
        const otp = credentials.otp as string

        const tokens = await prisma.verificationToken.findMany({
          where: { identifier: email, expires: { gt: new Date() } },
          orderBy: { expires: "desc" },
        })
        let matched: (typeof tokens)[0] | null = null
        for (const t of tokens) {
          if (await bcrypt.compare(otp, t.token)) {
            matched = t
            break
          }
        }
        if (!matched) return null

        try {
          await prisma.verificationToken.delete({
            where: { identifier_token: { identifier: matched.identifier, token: matched.token } },
          })
        } catch {}

        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({
            data: { email, emailVerified: new Date() },
          })
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isProfileComplete: (user as any).isProfileComplete,
        }
      },
    }),

    // ─── Google OAuth ────────────────────────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
  ],

  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as Record<string, unknown>).role ?? "user"
        token.isProfileComplete = (user as Record<string, unknown>).isProfileComplete ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isProfileComplete = token.isProfileComplete as boolean
      }
      return session
    },
  },
})

export function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user?.role === "admin"
}
