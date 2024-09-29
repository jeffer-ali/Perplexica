// app/api/verifyToken/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import admin from '@/lib/auth/firebase-admin';
import { encrypt } from '@/lib/cookie';
import { saveUser } from '@/lib/actions/user'
import { pick } from 'lodash'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const userInfo: UserInfo = await admin.auth().verifyIdToken(token);

    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn: 60 * 60 * 24 * 10 * 1000 })

    const firebaseToken = encrypt(sessionCookie)
    await saveUser(firebaseToken, pick(userInfo, ['uid', 'email', 'name', 'picture']))

    const cookie = serialize('firebaseToken', firebaseToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 10, // 10 days
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
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
