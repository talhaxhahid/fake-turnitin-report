import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDb } from '../../lib/mongodb';

export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  captchaNum1?: number;
  captchaNum2?: number;
  captchaAnswer?: number;
  honeypot?: string;
  formLoadedAt?: number;
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1. Anti-Bot Trap 1: Honeypot Check
  // If automated spam bots fill out invisible honeypot field, drop silently.
  if (body.honeypot && body.honeypot.trim() !== '') {
    console.warn('Spam bot blocked via honeypot trap.');
    return NextResponse.json({ ok: true });
  }

  // 2. Anti-Bot Trap 2: Fast Submission Time Check
  // Humans take at least ~1.5s to fill out the form
  if (body.formLoadedAt && Date.now() - body.formLoadedAt < 1500) {
    console.warn('Spam bot blocked via fast submission timing.');
    return NextResponse.json({ error: 'Automated submission detected. Please try again.' }, { status: 400 });
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

  // 3. Verification Puzzle Check
  const num1 = body.captchaNum1;
  const num2 = body.captchaNum2;
  const answer = body.captchaAnswer;

  if (
    typeof num1 !== 'number' ||
    typeof num2 !== 'number' ||
    typeof answer !== 'number' ||
    answer !== num1 + num2
  ) {
    errors.captchaAnswer = 'Incorrect answer. Please solve the security question.';
  }

  if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Field too long.' }, { status: 400 });
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Validation failed', errors }, { status: 422 });
  }

  const headers = request.headers;
  const ip =
    (headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    null;

  // Log message to MongoDB database (non-blocking if DB fails)
  try {
    const db = await getDb();
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
  } catch (dbErr) {
    console.error('MongoDB insertion failed in /api/contact:', dbErr);
  }

  // Send email notification via SMTP
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'website@freeplagiarismreport.com';
    const smtpPass = process.env.SMTP_PASS || 'Pixelwebdev@6015';
    const contactEmail = process.env.CONTACT_EMAIL || 'info@freeplagiarismreport.com';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Free Plagiarism Report" <${smtpUser}>`,
      to: contactEmail,
      replyTo: `"${name}" <${email}>`,
      subject: `New Contact Message: ${subject}`,
      text: `New contact form submission on Free Plagiarism Report:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSubmitted IP: ${ip || 'Unknown'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background-color: #0f172a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Form Message</h2>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Subject:</td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(subject)}</td>
              </tr>
            </table>
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin-top: 10px;">
              <h4 style="margin: 0 0 8px 0; color: #334155;">Message:</h4>
              <p style="white-space: pre-wrap; margin: 0; color: #1e293b;">${escapeHtml(message)}</p>
            </div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">
              Submitted on ${new Date().toUTCString()} | IP: ${ip || 'Unknown'}
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (emailErr) {
    console.error('Failed to send SMTP email in /api/contact:', emailErr);
    return NextResponse.json(
      { error: 'Failed to send message via email server. Please try again.' },
      { status: 500 }
    );
  }
}
