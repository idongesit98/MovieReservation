import {createClient} from "redis";

export const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on('error',err => console.log("Redis client Error",err))

export async function connectRedis(){
    try {
        await redisClient.connect();
        console.log("Connected to Redis")

        //Setting a test key
        const setReply = await redisClient.set("testkey","Redis is working!");
        console.log("Set Reply:",setReply);

        //Get the test key
        const value = await redisClient.get("testKey");
        console.log("Get value:", value);
    } catch (error) {
        console.error("Redis connection/test failed:", error)    
    }
}