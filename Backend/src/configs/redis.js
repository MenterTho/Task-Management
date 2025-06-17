const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('connect', () => console.log('Redis connected successfully'));
client.on('error', (err) => console.error('Redis connection error:', err));

client.connect().catch(console.error);

module.exports = client;