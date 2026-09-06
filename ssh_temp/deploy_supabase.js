const { Client } = require('ssh2');

const conn = new Client();

const SERVER = {
  host: '163.61.183.125',
  port: 22,
  username: 'root',
  password: 'RvPwOC6nDbob4Q5i',
  readyTimeout: 30000
};

const PROJECT_PATH = '/var/www/wedding';

// The new .env content for the server
const ENV_CONTENT = `PORT=3000
DATABASE_URL=postgresql://postgres.knhmjnaldlrztvnfluox:L!nhtr%40n294@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
`;

conn.on('ready', () => {
  console.log('🔗 SSH connected to server');

  // Commands to run on server sequentially
  const commands = [
    // 1. Write new .env
    `printf '${ENV_CONTENT.replace(/'/g, "'\\''")}' > ${PROJECT_PATH}/backend/.env`,
    // 2. Pull latest code from GitHub
    `cd ${PROJECT_PATH} && git fetch --all && git reset --hard origin/main`,
    // 3. Install new dependencies (pg) and remove mongoose
    `cd ${PROJECT_PATH}/backend && npm install --save pg && npm uninstall mongoose --save 2>/dev/null || true`,
    // 4. Run database migration (safe - uses IF NOT EXISTS)
    `cd ${PROJECT_PATH}/backend && node migrate.js`,
    // 5. Restart PM2
    `pm2 restart wedding-invite-api || pm2 start ${PROJECT_PATH}/deployment/ecosystem.config.js`
  ];

  const fullCommand = commands.join(' && ');
  console.log('📦 Running deployment commands...\n');

  conn.exec(fullCommand, (err, stream) => {
    if (err) {
      console.error('❌ Exec error:', err);
      conn.end();
      return;
    }

    stream
      .on('close', (code) => {
        console.log(`\n✅ Deployment finished with exit code: ${code}`);
        conn.end();
      })
      .on('data', data => process.stdout.write(data.toString()))
      .stderr.on('data', data => process.stderr.write(data.toString()));
  });

}).on('error', (err) => {
  console.error('❌ SSH connection error:', err.message);
  process.exit(1);
}).connect(SERVER);
