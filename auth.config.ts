import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
    providers: [
        Credentials({
            id: "admin-credentials",
            name: "Admin",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                if (
                    credentials?.email === process.env.ADMIN_EMAIL &&
                    credentials?.password === process.env.ADMIN_PASSWORD
                ) {
                    return {
                        id: "admin",
                        email: process.env.ADMIN_EMAIL,
                        role: "admin",
                    }
                }

                return null
            },
        }),
    ],

    pages: {
        signIn: "/admin/login",
    },

    callbacks: {
        authorized() {
            return true
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role ?? "user"
                token.isProfileComplete = (user as any).isProfileComplete ?? false
            }
            return token
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.isProfileComplete = token.isProfileComplete as boolean
            }
            return session
        },
    },
} satisfies NextAuthConfig