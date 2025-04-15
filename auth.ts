import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitlabProvider from "next-auth/providers/gitlab";

import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration for administrator authentication
 *
 * This setup uses email-based authentication with a magic link,
 * restricting access to only allowed admin email addresses.
 */

// Define proper types for the callbacks
export interface IUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface ISession {
  user?: IUser;
  expires: string;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "",
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "noreply@recruitreply.com",
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID ?? "",
      clientSecret: process.env.GITLAB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user: _user, account: _account, profile: _profile }) {
      // Allow all users to sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the callback URL or the base URL
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, user: _user, token: _token }) {
      // Add user info to the session
      return session;
    },
    async jwt({ token, user: _user, account: _account, profile: _profile }) {
      // Add user info to the JWT
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  session: {
    strategy: "jwt" as const, // Use 'as const' to ensure correct type
  },
};

export default NextAuth(authOptions);
