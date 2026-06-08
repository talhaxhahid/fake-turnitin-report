import { NextResponse } from 'next/server';
import { getDb } from '../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection('stats').findOne({ _id: 'reports' as unknown as never });
    const count = (doc?.count as number | undefined) ?? 0;
    return NextResponse.json(
      { count },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('GET /api/stats failed', err);
    return NextResponse.json({ count: 0, error: 'unavailable' }, { status: 200 });
  }
}
