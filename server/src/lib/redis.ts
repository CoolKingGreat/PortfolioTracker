import { createClient } from 'redis';

// Conditionally create the options object
const clientOptions = process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined;

const redisClient = createClient(clientOptions);

redisClient.on('error', (err: Error) => {
  console.log('Redis Client Error', err);
});

(async () => {
  try {
    if (redisClient) {
      await redisClient.connect();
      console.log('Connected to Redis successfully!');
    }
  } catch (err) {
    console.error('Could not connect to Redis:', err);
  }
})();

export default redisClient;