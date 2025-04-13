import { NextRequest, NextResponse } from 'next/server';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * API route for verifying Cloudflare Turnstile tokens
 *
 * This endpoint verifies tokens generated by the Turnstile widget
 * to ensure the user is human before allowing access to the chat.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json();
    const { token } = body;

    // Get the visitor's IP address
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Validate the request
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required and must be a string' },
        { status: 400 }
      );
    }

    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify the token with Cloudflare
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);

    if (ip) {
      formData.append('remoteip', ip);
    }

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });

    const outcome = await result.json();

    if (outcome.success) {
      // Token is valid
      return NextResponse.json({
        success: true,
        challenge_ts: outcome.challenge_ts,
        hostname: outcome.hostname,
      });
    } else {
      // Token is invalid
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
          details: outcome['error-codes'],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify token' },
      { status: 500 }
    );
  }
}
