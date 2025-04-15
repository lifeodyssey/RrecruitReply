import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

/**
 * NextAuth configuration for administrator authentication
 *
 * This setup uses email-based authentication with a magic link,
 * restricting access to only allowed admin email addresses.
 */

// Define proper types for the callbacks
interface IUser {
  email?: string;
  role?: string;
}

// Extend the Session type to include role
declare module 'next-auth' {
  interface ISession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || '',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@recruitreply.com',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific email address(es)
      const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || '').split(',');
      // Ensure user.email is not null or undefined before checking includes
      return !!user.email && allowedEmails.includes(user.email);
    },
    async session({ session, user }) {
      // Add role to session
      if (session.user) {
        // Ensure user object exists and has a role property before assigning
        (session.user as IUser).role = (user as IUser)?.role || 'admin';
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
  session: {
    strategy: 'jwt' as const, // Use 'as const' to ensure correct type
  },
});

export { handler as GET, handler as POST };
