import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const db = await getDb();
    const result = await db.collection('stats').findOneAndUpdate(
      { _id: 'reports' as unknown as never },
      {
        $inc: { count: 1 },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const count = (result?.count as number | undefined) ?? 1;
    return NextResponse.json({ count }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('POST /api/stats/increment failed', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
