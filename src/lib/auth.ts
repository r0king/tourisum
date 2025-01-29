import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Guide from "@/models/guide";

interface ExtendedUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                await connectDB();
                console.log(credentials)

                const collection = credentials?.role === 'guide' ? Guide : User;

                const user = await collection.findOne({
                    email: credentials?.email,
                }).select("+password");

                if (!user) throw new Error("Wrong Email");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Wrong Password");
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role || (user.status === 'active' ? 'guide' : 'pending_guide')
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as ExtendedUser).id
                token.role = (user as ExtendedUser).role
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as ExtendedUser).id = token.id as string
                (session.user as ExtendedUser).role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },

};