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
} satisfies NextAuthConfig