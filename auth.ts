import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration for administrator authentication
 *
 * This setup uses email-based authentication with a magic link,
 * restricting access to only allowed admin email addresses.
 */

// Define proper types for the callbacks
type User = {
  email?: string;
  role?: string;
};

type Session = {
  user?: {
    role?: string;
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific email address(es)
      const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "").split(",");
      return allowedEmails.includes(user.email || "");
    },
    async session({ session, user }) {
      // Add role to session
      if (session.user) {
        session.user.role = user.role || "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  session: {
    strategy: "jwt" as const, // Use 'as const' to ensure correct type
  },
});
