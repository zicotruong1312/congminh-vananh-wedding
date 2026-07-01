module.exports = {
  apps: [{
    name: "wedding-invite-api",
    script: "./backend/server.js",
    instances: "max", // Or a specific number like 2, depending on server cores
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000,
      MONGO_URI: "mongodb://127.0.0.1:27017/wedding_prod" // Update as needed
    }
  }]
};
