import { NextRequest, NextResponse } from 'next/server';
import { bindAnonymousToken } from '../../../lib/actions/chat';
// import { getUserByToken } from '@/lib/auth/firebase-admin';
import { getUser } from '@/lib/actions/user'
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/cookie';

export async function POST() {
  try {
    const user = await getUser()
    const id = user?.uid;

    const cookieStore = cookies();
    const anonymousToken = cookieStore.get('anonymousToken')?.value;
    if (!anonymousToken) {
      throw new Error('Anonymous token not found');
    }

    const query = decrypt(anonymousToken);
    await bindAnonymousToken(id, query);

    // 返回新创建的 Site 记录
    return new Response(JSON.stringify({ success: true }), {
      status: 201, // 201 Created
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // 处理错误情况
    console.error('Failed to link anonymous token to user id:', error);

    return new NextResponse(JSON.stringify({ error: 'Failed to link anonymous token to user id' }), {
      status: 500, // 500 Internal Server Error
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}