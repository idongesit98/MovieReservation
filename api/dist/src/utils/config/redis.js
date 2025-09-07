"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
exports.redisClient.on('error', err => console.log("Redis client Error", err));
async function connectRedis() {
    try {
        await exports.redisClient.connect();
        console.log("Connected to Redis");
        //Setting a test key
        const setReply = await exports.redisClient.set("testkey", "Redis is working!");
        console.log("Set Reply:", setReply);
        //Get the test key
        const value = await exports.redisClient.get("testKey");
        console.log("Get value:", value);
    }
    catch (error) {
        console.error("Redis connection/test failed:", error);
    }
}
