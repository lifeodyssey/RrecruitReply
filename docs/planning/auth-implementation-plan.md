# Authentication System Implementation Plan

This document outlines the detailed implementation plan for the authentication system in the RecruitReply application.

## Overview

The authentication system will have two distinct approaches:
1. **Recruiter Side**: Public access with Cloudflare Turnstile CAPTCHA verification
2. **Admin Side**: Simple but secure authentication for a single administrator

## 1. Recruiter Authentication Implementation

### Cloudflare Turnstile Integration

#### 1.1 Create Turnstile Widget in Cloudflare Dashboard
- Log in to Cloudflare dashboard
- Navigate to Turnstile section
- Create a new widget with the following settings:
  - Widget type: Managed Challenge
  - Domains: Add the application domain
  - Widget mode: Always Visible

#### 1.2 Frontend Implementation
- Add Turnstile script to the application layout:
  ```html
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  ```
- Create a Turnstile component in the chat interface:
  ```tsx
  // src/components/turnstile/TurnstileWidget.tsx
  import { useEffect, useRef } from 'react';

  interface TurnstileWidgetProps {
    siteKey: string;
    onVerify: (token: string) => void;
  }

  export function TurnstileWidget({ siteKey, onVerify }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      
      // @ts-ignore - Turnstile is loaded from external script
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
      });
      
      return () => {
        // @ts-ignore - Turnstile is loaded from external script
        if (window.turnstile) {
          window.turnstile.reset(containerRef.current);
        }
      };
    }, [siteKey, onVerify]);

    return <div ref={containerRef} />;
  }
  ```

#### 1.3 Backend Verification
- Create an API route to verify Turnstile tokens:
  ```tsx
  // src/app/api/turnstile/verify/route.ts
  import { NextRequest, NextResponse } from 'next/server';

  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;
  const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { token } = body;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Missing token' },
          { status: 400 }
        );
      }
      
      // Verify the token with Cloudflare
      const formData = new FormData();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', token);
      
      const result = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        body: formData,
      });
      
      const outcome = await result.json();
      
      if (outcome.success) {
        // Store verification status in session or cookie
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: 'Invalid token', details: outcome['error-codes'] },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error verifying Turnstile token:', error);
      return NextResponse.json(
        { error: 'Failed to verify token' },
        { status: 500 }
      );
    }
  }
  ```

#### 1.4 Integration with Chat Interface
- Add Turnstile verification before allowing first query
- Store verification status in localStorage or session
- Only show the CAPTCHA once per session

## 2. Administrator Authentication Implementation

### Next.js Authentication Setup

#### 2.1 Configure Next-Auth
- Install required packages:
  ```bash
  npm install next-auth@beta @auth/prisma-adapter
  ```

- Create authentication configuration:
  ```tsx
  // src/app/api/auth/[...nextauth]/route.ts
  import NextAuth from 'next-auth';
  import { PrismaAdapter } from '@auth/prisma-adapter';
  import EmailProvider from 'next-auth/providers/email';
  import { prisma } from '@/lib/prisma';

  const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
    ],
    callbacks: {
      async signIn({ user }) {
        // Only allow specific email address(es)
        const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || '').split(',');
        return allowedEmails.includes(user.email || '');
      },
      async session({ session, user }) {
        if (session.user) {
          session.user.role = user.role;
        }
        return session;
      },
    },
    pages: {
      signIn: '/admin/login',
      error: '/admin/error',
    },
    session: {
      strategy: 'jwt',
    },
  });

  export { handler as GET, handler as POST };
  ```

#### 2.2 Create Admin Login Page
- Create a login page for administrators:
  ```tsx
  // src/app/admin/login/page.tsx
  import { SignInForm } from '@/components/auth/SignInForm';

  export default function AdminLoginPage() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <SignInForm />
        </div>
      </div>
    );
  }
  ```

#### 2.3 Create Authentication Components
- Create sign-in form component:
  ```tsx
  // src/components/auth/SignInForm.tsx
  'use client';

  import { useState } from 'react';
  import { signIn } from 'next-auth/react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';

  export function SignInForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setMessage(null);

      try {
        const result = await signIn('email', {
          email,
          redirect: false,
        });

        if (result?.error) {
          setMessage('Authentication failed. Please try again.');
        } else {
          setMessage('Check your email for a sign-in link.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending link...' : 'Sign in with Email'}
        </Button>
        
        {message && (
          <p className="text-sm text-center mt-2">{message}</p>
        )}
      </form>
    );
  }
  ```

#### 2.4 Create Protected Routes Middleware
- Create middleware to protect admin routes:
  ```tsx
  // src/middleware.ts
  import { NextResponse } from 'next/server';
  import { getToken } from 'next-auth/jwt';
  import { NextRequest } from 'next/server';

  export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Check if the path is for admin routes
    if (path.startsWith('/admin') && path !== '/admin/login') {
      const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      
      // Redirect to login if not authenticated
      if (!session) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
    
    return NextResponse.next();
  }

  export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
  };
  ```

## 3. Environment Configuration

### 3.1 Required Environment Variables
- Add the following environment variables to the project:
  ```
  # Turnstile Configuration
  NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
  TURNSTILE_SECRET_KEY=your-turnstile-secret-key

  # NextAuth Configuration
  NEXTAUTH_URL=https://your-app-url.com
  NEXTAUTH_SECRET=your-nextauth-secret

  # Email Provider Configuration
  EMAIL_SERVER_HOST=smtp.example.com
  EMAIL_SERVER_PORT=587
  EMAIL_SERVER_USER=your-email-user
  EMAIL_SERVER_PASSWORD=your-email-password
  EMAIL_FROM=noreply@example.com

  # Admin Access Control
  ALLOWED_ADMIN_EMAILS=admin@example.com
  ```

### 3.2 Update Terraform Configuration
- Add Turnstile configuration to Terraform:
  ```hcl
  # terraform/modules/turnstile/main.tf
  resource "cloudflare_turnstile_widget" "recruit_reply" {
    name    = "RecruitReply Widget"
    domains = [var.app_domain]
    mode    = "managed"
  }

  output "site_key" {
    value = cloudflare_turnstile_widget.recruit_reply.site_key
  }

  output "secret_key" {
    value     = cloudflare_turnstile_widget.recruit_reply.secret_key
    sensitive = true
  }
  ```

## 4. Testing Plan

### 4.1 Recruiter Authentication Tests
- Test Turnstile widget rendering
- Test token verification API
- Test session persistence
- Test bot protection capabilities

### 4.2 Administrator Authentication Tests
- Test email authentication flow
- Test protected route access
- Test unauthorized access attempts
- Test session management

## 5. Implementation Timeline

1. **Day 1**: Set up Cloudflare Turnstile and implement frontend components
2. **Day 2**: Implement Next.js authentication and admin login page
3. **Day 3**: Create protected routes and middleware
4. **Day 4**: Testing and refinement

## 6. Security Considerations

- Store all secrets securely in environment variables
- Implement rate limiting for authentication attempts
- Regularly rotate authentication secrets
- Monitor for suspicious authentication patterns
- Ensure proper CORS configuration for API endpoints
