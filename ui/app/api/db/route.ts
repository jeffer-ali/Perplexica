import { NextRequest, NextResponse } from 'next/server';
import superjson from "superjson";
import { Client } from 'pg';
import { getIPAddresses } from '@/lib/utils/ip'

export async function POST(req: NextRequest, res: NextResponse) {
  // if token is not YWRtaW46YWR, return
  const token = req.headers.get('Authorization')
  if (token !== 'Basic YWRtaW46YWR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new Client({
    connectionString: process.env.USED_POSTGRES_URL_NON_POOLING,
    // ssl: { rejectUnauthorized: false },
  });

  try {
    // const query = req.nextUrl.searchParams.get('q')
    // await fetch('https://x-answer.app.n8n.cloud/webhook/bd02e3cd-e005-4e59-86d5-338600ef09c5')
    const query = await req.text()
    if (!query) {
      return NextResponse.json({ error: 'Query string is missing' }, { status: 400 });
    }

    const { sql, parameters } = superjson.parse(query) as any
    if (!sql) {
      return NextResponse.json({ error: 'sql string is missing' }, { status: 400 });
    }
    await client.connect();
    console.log('Executing query:', sql);
    const result = await client.query(sql, parameters);
    await client.end();

    return new Response(superjson.stringify({
      rows: result.rows,
    }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Failed to execute query:', error);
    return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 });
  }
};