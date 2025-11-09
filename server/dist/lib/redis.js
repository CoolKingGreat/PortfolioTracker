"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// Conditionally create the options object
const clientOptions = process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined;
const redisClient = (0, redis_1.createClient)(clientOptions);
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});
(async () => {
    try {
        if (redisClient) {
            await redisClient.connect();
            console.log('Connected to Redis successfully!');
        }
    }
    catch (err) {
        console.error('Could not connect to Redis:', err);
    }
})();
exports.default = redisClient;
//# sourceMappingURL=redis.js.map