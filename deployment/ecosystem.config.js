module.exports = {
  apps: [{
    name: "wedding-invite-api",
    script: "/var/www/wedding/backend/server.js",
    cwd: "/var/www/wedding",
    instances: 1,
    exec_mode: "fork",
    env_file: "/var/www/wedding/backend/.env",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
