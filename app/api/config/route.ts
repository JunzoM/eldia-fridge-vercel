import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_ANON_KEY || '',
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
