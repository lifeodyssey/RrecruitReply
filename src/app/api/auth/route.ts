import { NextRequest, NextResponse } from 'next/server';
import Auth, { authOptions } from './auth';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return Auth(req) as Promise<NextResponse>;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return Auth(req) as Promise<NextResponse>;
}; 