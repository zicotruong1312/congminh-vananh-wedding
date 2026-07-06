const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  
  const p = '/var/www/wedding';
  const repo = 'https://github.com/zicotruong1312/congminh-vananh-wedding.git';
  
  const commands = `
    cd ${p}
    git fetch --all
    git reset --hard origin/main
    pm2 restart wedding-api
  `;
  
  console.log('Executing:', commands);
  
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Done pulling and restarting.');
      conn.end();
    }).on('data', data => console.log('STDOUT:', data.toString()))
      .stderr.on('data', data => console.log('STDERR:', data.toString()));
  });

}).connect({
  host: '163.61.183.125',
  port: 22,
  username: 'root',
  password: 'RvPwOC6nDbob4Q5i',
  readyTimeout: 20000
});
