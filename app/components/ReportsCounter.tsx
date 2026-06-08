'use client';

import { useEffect, useState } from 'react';

function format(n: number) {
  return n.toLocaleString('en-US');
}

export default function ReportsCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && typeof data?.count === 'number') {
          setCount(data.count);
        }
      } catch {
        if (!cancelled) setCount(0);
      }
    };

    load();

    const onBump = () => load();
    window.addEventListener('reports-counter:bump', onBump);

    return () => {
      cancelled = true;
      window.removeEventListener('reports-counter:bump', onBump);
    };
  }, []);

  return (
    <span className="counter-value" aria-live="polite">
      {count === null ? '…' : format(count)}
    </span>
  );
}
