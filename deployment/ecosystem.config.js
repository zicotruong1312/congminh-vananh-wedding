module.exports = {
  apps: [{
    name: "wedding-invite-api",
    script: "./backend/server.js",
    instances: 1,
    exec_mode: "fork",
    env_file: "./backend/.env",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
