// import { createClient } from "redis";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

// // Create Redis client instance
// const redisClient = createClient({
//   socket: {
//     host: process.env.REDIS_URL || process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
//   },
// });

// // Handle Redis events
// redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
// redisClient.on("connect", () => console.log("✅ Connected to Redis"));

// // Connect to Redis once (only if not already connected)
// let isRedisConnected = false;

// const connectRedis = async () => {
//   if (!isRedisConnected) {
//     try {
//       await redisClient.connect();
//       isRedisConnected = true; // Mark Redis as connected
//     } catch (err) {
//       console.error("Error connecting to Redis:", err);
//     }
//   }
// };

// export { redisClient, connectRedis };
