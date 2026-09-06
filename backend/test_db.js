require('dotenv').config();
const { testConnection, pool } = require('./db');

testConnection()
  .then(() => pool.query('SELECT COUNT(*) FROM rsvps'))
  .then(r => {
    console.log('rsvps count:', r.rows[0].count);
    return pool.end();
  })
  .then(() => console.log('✅ All tests passed!'))
  .catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
