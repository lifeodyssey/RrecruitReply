# Authentication System

This document provides information on setting up and using the authentication system in the RecruitReply application.

## Overview

The authentication system has two distinct approaches:

1. **Recruiter Authentication**: Public access with Cloudflare Turnstile CAPTCHA verification
2. **Admin Authentication**: Email-based authentication for a single administrator

## Recruiter Authentication

The recruiter interface is publicly accessible but protected by Cloudflare Turnstile to prevent bot abuse.

### Setup Instructions

1. **Create a Turnstile Widget**:
   - Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Security** > **Turnstile**
   - Click **Add Site**
   - Configure the widget:
     - **Name**: RecruitReply
     - **Domains**: Add your application domain
     - **Widget Type**: Managed Challenge
     - **Widget Mode**: Always Visible
   - Click **Create**
   - Copy the **Site Key** and **Secret Key**

2. **Configure Environment Variables**:
   - Add the following to your `.env` file:
     ```
     NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
     TURNSTILE_SECRET_KEY=your-secret-key
     ```

3. **Integrate with Chat Interface**:
   - The Turnstile verification will appear before the first query
   - Once verified, the user can use the chat interface without further verification for 24 hours

## Admin Authentication

The admin interface is protected by email-based authentication, allowing only authorized administrators to access it.

### Setup Instructions

1. **Configure Email Provider**:
   - Set up an SMTP server for sending authentication emails
   - Add the following to your `.env` file:
     ```
     EMAIL_SERVER_HOST=smtp.example.com
     EMAIL_SERVER_PORT=587
     EMAIL_SERVER_USER=your-email-user
     EMAIL_SERVER_PASSWORD=your-email-password
     EMAIL_FROM=noreply@recruitreply.com
     ```

2. **Configure NextAuth**:
   - Generate a secure secret for NextAuth:
     ```bash
     openssl rand -base64 32
     ```
   - Add the following to your `.env` file:
     ```
     NEXTAUTH_URL=https://your-app-url.com
     NEXTAUTH_SECRET=your-generated-secret
     ALLOWED_ADMIN_EMAILS=admin@example.com
     ```

3. **Database Setup**:
   - Ensure your database is properly configured:
     ```
     DATABASE_URL="file:./dev.db"
     ```
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

## Usage

### Recruiter Interface

1. Visit the chat page
2. Complete the Turnstile verification when prompted
3. Use the chat interface to ask recruitment questions

### Admin Interface

1. Visit `/admin/login`
2. Enter your authorized email address
3. Check your email for a sign-in link
4. Click the link to access the admin dashboard

## Security Considerations

- All authentication secrets are stored securely in environment variables
- Admin authentication is restricted to specific email addresses
- Turnstile verification expires after 24 hours
- Protected routes are enforced by middleware
- API routes for admin functions are also protected

## Troubleshooting

### Turnstile Issues

- Ensure the Turnstile script is properly loaded
- Check that the site key and secret key are correctly configured
- Verify that your domain is allowed in the Turnstile widget settings

### Email Authentication Issues

- Check SMTP server configuration
- Ensure the allowed admin email is correctly set
- Verify that the NextAuth secret is properly configured
- Check email spam folders for authentication links
