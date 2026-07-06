const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('ls -la /var/www/wedding/backend/raw_images', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
          .on('data', data => console.log('STDOUT:', data.toString()))
          .stderr.on('data', data => console.log('STDERR:', data.toString()));
  });
}).connect({
  host: '163.61.183.125',
  port: 22,
  username: 'root',
  password: 'RvPwOC6nDbob4Q5i',
  readyTimeout: 20000
});
