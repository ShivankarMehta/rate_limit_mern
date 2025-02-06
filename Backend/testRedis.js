// import pkg from 'ioredis'
// import dotenv from "dotenv";
// dotenv.config();
// const {createClient} = pkg;

// const redisClient = createClient({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
// });

// redisClient.on("error", (err) => console.error("Redis Error:", err));

// redisClient.set("test", "Hello Redis", (err, reply) => {
//   if (err) {
//     console.error("Redis SET Error:", err);
//   } else {
//     console.log("Redis SET Reply:", reply);
//   }
// });

// redisClient.get("test", (err, reply) => {
//   if (err) {
//     console.error("Redis GET Error:", err);
//   } else {
//     console.log("Redis GET Reply:", reply);
//   }
// });
