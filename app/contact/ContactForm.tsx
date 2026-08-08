'use client';

import { useState, useEffect, useCallback } from 'react';

type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message' | 'captchaAnswer', string>>;

interface Challenge {
  num1: number;
  num2: number;
  expectedSum: number;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Anti-spam & Verification state
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formLoadedAt, setFormLoadedAt] = useState<number>(0);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const generateCaptcha = useCallback(() => {
    const n1 = Math.floor(Math.random() * 12) + 3; // 3 to 14
    const n2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    setChallenge({ num1: n1, num2: n2, expectedSum: n1 + n2 });
    setCaptchaInput('');
  }, []);

  useEffect(() => {
    generateCaptcha();
    setFormLoadedAt(Date.now());
  }, [generateCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrors({});
    setErrorText('');

    const userAns = parseInt(captchaInput.trim(), 10);
    if (isNaN(userAns) || userAns !== challenge?.expectedSum) {
      setErrors({ captchaAnswer: 'Incorrect answer. Please solve the security question.' });
      setStatus('error');
      setErrorText('Please answer the security math question correctly.');
      setSubmitting(false);
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          captchaNum1: challenge?.num1,
          captchaNum2: challenge?.num2,
          captchaAnswer: userAns,
          honeypot,
          formLoadedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setCaptchaInput('');
        setHoneypot('');
        generateCaptcha();
      } else if (res.status === 422 && data?.errors) {
        setErrors(data.errors as Errors);
        setStatus('error');
        setErrorText('Please correct the highlighted fields.');
        generateCaptcha();
      } else {
        setStatus('error');
        setErrorText(typeof data?.error === 'string' ? data.error : 'Something went wrong. Please try again.');
        generateCaptcha();
      }
    } catch {
      setStatus('error');
      setErrorText('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="form-grid" role="status">
        <div className="form-success">
          <div className="form-success-icon" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Message sent!</h3>
          <p>Thanks for reaching out. We&apos;ve received your message and will reply within 24 hours.</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setStatus('idle');
              generateCaptcha();
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      {/* Honeypot field for bot trapping (invisible to normal users) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="website_url_hp">Website URL (leave blank)</label>
        <input
          id="website_url_hp"
          name="website_url_hp"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            disabled={submitting}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            disabled={submitting}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help?"
          aria-invalid={!!errors.subject}
          disabled={submitting}
        />
        {errors.subject && <span className="field-error">{errors.subject}</span>}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more about your request..."
          aria-invalid={!!errors.message}
          disabled={submitting}
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </div>

      {/* Security Check Verification Card */}
      <div
        style={{
          background: 'var(--color-bg-alt, #f8fafc)',
          border: '1.5px solid var(--color-border, #e2e8f0)',
          borderRadius: 'var(--radius-md, 12px)',
          padding: '1.1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label
            htmlFor="captchaAnswer"
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--color-text-primary, #0f172a)',
            }}
          >
            <span style={{ fontSize: '1.15rem' }} role="img" aria-label="Shield">
              🛡️
            </span>
            Human Verification: What is {challenge ? `${challenge.num1} + ${challenge.num2}` : '...'}?
          </label>
          <button
            type="button"
            onClick={generateCaptcha}
            title="Generate a new question"
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary, #2563eb)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            id="captchaAnswer"
            name="captchaAnswer"
            type="number"
            required
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Your answer"
            style={{ maxWidth: '140px' }}
            aria-invalid={!!errors.captchaAnswer}
            disabled={submitting}
          />
          <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary, #64748b)' }}>
            Solve this simple sum to protect against spam bots.
          </span>
        </div>
        {errors.captchaAnswer && (
          <span className="field-error" style={{ display: 'block', marginTop: '0.2rem' }}>
            {errors.captchaAnswer}
          </span>
        )}
      </div>

      {status === 'error' && errorText && (
        <div className="form-error" role="alert">{errorText}</div>
      )}

      <button
        type="submit"
        className="btn-primary"
        style={{ justifySelf: 'start' }}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
