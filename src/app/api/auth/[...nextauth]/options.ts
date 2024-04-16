import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Corrected import
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "domain-login",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.email },
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found with this email address");
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not verified. Please verify your account.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("icorrect password. Please verify your account");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
       async jwt({token, user}){
        if (user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
        return token
       },
       async session({session, token}){
        if(token) {
           session.user._id = token._id 
           session.user.isVerified = token.isVerified
           session.user.isAcceptingMessages = token.isAcceptingMessages
           session.user.username = token.username
           session.user.email = token.email
        }
        return session
       },

    },
    pages:{
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

};
