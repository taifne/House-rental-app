require('dotenv').config(); // Load environment variables from .env file

const { createClient } = require('redis');

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  legacyMode: true
});

module.exports = client;
