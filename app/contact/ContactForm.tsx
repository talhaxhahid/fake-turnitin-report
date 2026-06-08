'use client';

import { useState } from 'react';

type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrors({});
    setErrorText('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else if (res.status === 422 && data?.errors) {
        setErrors(data.errors as Errors);
        setStatus('error');
        setErrorText('Please correct the highlighted fields.');
      } else {
        setStatus('error');
        setErrorText(typeof data?.error === 'string' ? data.error : 'Something went wrong. Please try again.');
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
            onClick={() => setStatus('idle')}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
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
