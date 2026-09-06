/**
 * migrate.js
 * Run this script ONCE on the server to create all tables in Supabase.
 * Usage: node migrate.js
 */
require('dotenv').config();
const { pool, testConnection } = require('./db');

const migrate = async () => {
  console.log('🚀 Starting database migration...');
  
  await testConnection();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Table: rsvps
    await client.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id              SERIAL PRIMARY KEY,
        guest_name      TEXT NOT NULL,
        is_attending    BOOLEAN NOT NULL,
        guest_count     INTEGER DEFAULT 0,
        absence_reason  TEXT DEFAULT '',
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table "rsvps" ready');

    // Table: wishes
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishes (
        id          SERIAL PRIMARY KEY,
        guest_name  TEXT NOT NULL,
        message     TEXT NOT NULL,
        ip_address  TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table "wishes" ready');

    // Table: guest_links
    await client.query(`
      CREATE TABLE IF NOT EXISTS guest_links (
        id          SERIAL PRIMARY KEY,
        guest_name  TEXT NOT NULL UNIQUE,
        link        TEXT NOT NULL,
        created_by  TEXT NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table "guest_links" ready');

    await client.query('COMMIT');
    console.log('✅ Migration complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
