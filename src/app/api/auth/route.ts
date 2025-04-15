import type { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';
import Auth from './auth';

export const GET = async (req: NextRequest): Promise<NextResponse> => Auth(req) as Promise<NextResponse>;

export const POST = async (req: NextRequest): Promise<NextResponse> => Auth(req) as Promise<NextResponse>;