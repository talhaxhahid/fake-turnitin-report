// One-off: reset the public reports counter to 0.
// Run with: `node scripts/reset-counter.mjs`
// Reads MONGODB_URI from .env.local.

import { readFileSync } from 'node:fs';
import { MongoClient } from 'mongodb';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'turnitin_report';

if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const result = await db.collection('stats').updateOne(
    { _id: 'reports' },
    { $set: { count: 0, lastUpdated: new Date() } },
    { upsert: true }
  );
  console.log('Counter reset to 0:', result.acknowledged, result.matchedCount, result.upsertedCount);
} finally {
  await client.close();
}
