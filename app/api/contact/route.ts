import { NextResponse } from 'next/server';
import { getDb } from '../../lib/mongodb';

export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const subject = (body.subject ?? '').trim();
  const message = (body.message ?? '').trim();

  const errors: Record<string, string> = {};
  if (!name || name.length < 2) errors.name = 'Please enter your name.';
  if (!email || !isEmail(email)) errors.email = 'Please enter a valid email.';
  if (!subject || subject.length < 3) errors.subject = 'Please add a subject.';
  if (!message || message.length < 10) errors.message = 'Please write a longer message.';

  if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Field too long.' }, { status: 400 });
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Validation failed', errors }, { status: 422 });
  }

  try {
    const db = await getDb();
    const headers = request.headers;
    const ip =
      (headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
      headers.get('x-real-ip') ||
      null;

    await db.collection('contact_messages').insertOne({
      name,
      email,
      subject,
      message,
      status: 'new',
      ip,
      userAgent: headers.get('user-agent') ?? null,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/contact failed', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
