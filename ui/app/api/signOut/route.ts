import { NextResponse } from 'next/server'
import { serialize } from 'cookie';

export const runtime = 'edge';

export async function POST() {
  // clean the firebaseToken cookie
  const cookie = serialize('firebaseToken', 'outdated', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 0,
    sameSite: 'strict',
    path: '/',
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200, // 500 Internal Server Error
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie
    },
  });
}