// import "dotenv/config";
// import express from "express";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs"; 
// import pkg from 'ioredis'
// import cors from "cors";
// import { check, validationResult } from "express-validator";
// import rateLimit from "express-rate-limit";
// const {createClient} = pkg;
// import RedisStore from "rate-limit-redis"


// const app=express();

// app.use(cors());
// app.use(express.json());
// const redisClient = createClient({
//   socket: {
//     host: process.env.REDIS_URL || process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
//   }

  
// });

// redisClient.on("error", (err) => console.error("Redis Error:", err));
// redisClient.on("connect", () => console.log("Connected to Redis"));
// let isRedisConnected = false;
// const connectRedis = async () => {
//   if (!isRedisConnected && !redisClient.isOpen) {
//     try {
//       await redisClient.connect();
//       isRedisConnected = true; // Mark Redis as connected
//     } catch (err) {
//       console.error("Error connecting to Redis:", err);
//     }
//   }
// };

// const disconnectRedis = async () => {
//   if (isRedisConnected) {
//     try {
//       await redisClient.disconnect();
//       console.log("Redis Disconnected");
//       isRedisConnected = false;
//     } catch (err) {
//       console.error("Error disconnecting Redis:", err);
//     }
//   }
// };

// await connectRedis();

// mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})  
//             .then(()=>console.log("MongoDB Connected"))
//             .catch(err=>console.error(err));
            
// const port=process.env.PORT || 5000;

// const apiLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: async (...args) => {
//       await connectRedis();
//       return redisClient.sendCommand(args);
//     },
//   }),
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: "Too many requests, slow down!" },
// });
// //Basic Rate Limiting (100 requests per 15 min per IP)
// // const apiLimiter=rateLimit({
// //     windowMs:15*60*1000, //15 minutes
// //     max:100, //Max request per IP
// //     message:{error:"Too many requests,please try again later."}
// // });

// app.use(apiLimiter);


// // const loginLimiter=rateLimit({
// //     windowMs:60*60*1000,
// //     max:100,
// //     message:{"error":"Too many login requests,please try again later."}
// // });

// const loginLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: async (...args) => {
//       await connectRedis();
//       return redisClient.sendCommand(args);
//     },
//   }),
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100, // Max 100 login attempts per IP
//   message: { error: "Too many login requests, please try again later." },
// });

// const registerLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: async (...args) => {
//       await connectRedis();
//       return redisClient.sendCommand(args);
//     },
//   }),
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 20, // Max 20 sign-up attempts per IP
//   message: { error: "Too many sign-up attempts. Try again later." },
// });

// // const registerLimiter = rateLimit({
// //     windowMs: 60 * 60 * 1000, // 1 hour
// //     max: 20, // Limit each IP to 5 requests per hour
// //     message: { error: "Too many sign-up attempts. Try again later." },
// //   });

// const UserSchema=new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// })

// const User=mongoose.model("User",UserSchema);

// app.post("/rate/register",registerLimiter, [
//     check("username", "Username is required").not().isEmpty(),
//     check("email", "Please enter a valid email").isEmail(),
//     check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
//   ],async(req,res)=>{

//     const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ error: errors.array() });
//   }
//    const {username,email,password}=req.body;

//     try{
//         let existingUser=await User.findOne({email});

//         if(existingUser){
//             return res.status(400).json({error:"User already exists"});
//         }


//         const salt=await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hash(password,salt);

//         const newUser= new User({
//             username,
//             email,
//             password:hashedPassword,
//         });
//         await newUser.save();
//         res.status(201).json({message:"User registered successfully!",data:newUser});
//     }
//     catch(error){
//         res.status(500).json({error:"Server error"});
//     }
// })

// app.post("/rate/login",loginLimiter,async(req,res)=>{
//     const {username,password}=req.body;
//     try {
//         // Find user by username
//         const user = await User.findOne({ username });
//         if (!user) {
//           return res.status(401).json({ error: "Invalid credentials" });
//         }
    
//         // Compare hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return res.status(401).json({ error: "Invalid credentials" });
//         }
    
//         res.json({ message: "Login successful" });
    
//       } catch (error) {
//         res.status(500).json({ error: "Server error" });
//       }
// })

// app.get("/rate/data",async (req,res)=>{
//     try{
//     const users=await User.find();
//     res.json({message:"This is rate-limited data.", data: users,})
//     }
//     catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Server error" });
//       }
// });

// const server=app.listen(port, () => console.log(`Server running on port ${port}`));

// process.on("SIGINT", async () => {
//   console.log("\n Server shutting down...");
//   await disconnectRedis();
//   server.close(() => {
//     console.log(" Server stopped.");
//     process.exit(0);
//   });
// });


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcrypt";
// import pool from "./db.js";

// dotenv.config();
// const app=express();
// app.use(cors());
// app.use(express.json());

// const rateLimitCheck=async (ip,rateLimit,timeframe)=>{
//   try{
//     const [result]=await pool.query(
//       "SELECT request_count, last_request FROM rate_limits WHERE ip=?",
//       [ip]
//     );
//     if(result.length===0){
//      await pool.query(
//      "INSERT INTO rate_limits (ip,request_count) VALUES (?,1)",
//      [ip]
//      );
//      return true;
//     }
//     const {request_count,last_request}=result[0];
//     const timeDiff=(new Date()-new Date(last_request)) /1000;

//     if(timeDiff>timeframe) {
//       await pool.query(
//         "UPDATE rate_limits SET request_count=1, last_request=CURRENT_TIMESTAMP WHERE ip=?", [ip]
//       );
//       return true;
//     }

//   }
//   catch (error) {
//     console.error("Rate Limit Check Error:", error);
//     return false; // Default to blocking if an error occurs
// }
// }

//Fixed Window Approach

// const express = require("express");
// const dotenv = require("dotenv").config();
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const redis = require("redis");
// const cors = require("cors");
// const { check, validationResult } = require("express-validator");
// const rateLimit = require("express-rate-limit");
// const { RedisStore } = require("rate-limit-redis");



// const app = express();

// app.use(cors());
// app.use(express.json());


// mongoose.connect(process.env.MONGO_URI)  
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.error("MongoDB Connection Error:", err));

// const port = process.env.PORT || 5000;

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// const User = mongoose.model("User", UserSchema);


// const redisClient =redis.createClient({
//   socket: {
//     host: "127.0.0.1",
//     port: 6379,
//   }
// });

// redisClient.connect()
// .then(()=> console.log("Connected to Redis!"))
// .catch(err=>console.error("Redis Connection Error",err));


// const apiLimiter = rateLimit({
//   store: new RedisStore({
//       sendCommand: async (...args) => {
//           if (!redisClient.isOpen) {
//               await redisClient.connect();
//           }
//           return redisClient.sendCommand(args);
//       },
//       prefix: "api_limiter:",
//   }),
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: { error: "Too many requests, slow down!" },
// });

// const loginLimiter = rateLimit({
//   store: new RedisStore({
//       sendCommand: async (...args) => {
//           if (!redisClient.isOpen) {
//               await redisClient.connect();
//           }
//           return redisClient.sendCommand(args);
//       },
//      prefix: "login_limiter:",
//   }),
//   windowMs: 10 * 60 * 1000, 
//   max: 2, 
//   message: { error: "Too many login attempts. Try again later." },
// });




// app.get("/rate/data",apiLimiter,async (req, res) => {
//   try {
//     // **Check Redis First**
//     const cachedUsers = await redisClient.get("users");
    
//     if (cachedUsers) {
//       console.log("Serving from Redis Cache");
//       return res.json({ message: "Data from Redis", data: JSON.parse(cachedUsers) });
//     }

//     console.log("Fetching from MongoDB...");
//     const users = await User.find();

//     // **Store Data in Redis for Future Requests (Cache Expiry: 1 Hour)**
//     await redisClient.setEx("users", 3600, JSON.stringify(users));

//     res.json({ message: "Data from MongoDB", data: users });

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// app.post("/rate/register", [
//   check("username", "Username is required").not().isEmpty(),
//   check("email", "Please enter a valid email").isEmail(),
//   check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ error: errors.array() });
//   }
//   const { username, email, password } = req.body;

//   try {
//     let existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // **Update Redis Cache After New User Registration**
//     const users = await User.find();
    
//       await redisClient.setEx("users", 3600, JSON.stringify(users));


//     res.status(201).json({ message: "User registered successfully!", data: newUser });

//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


// app.post("/rate/login", loginLimiter,async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     res.json({ message: "Login successful" });

//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

//  app.listen(port, () => console.log(`Server running on port ${port}`));


const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");



const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)  
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const port = process.env.PORT || 5000;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);


const redisClient =redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  }
});

redisClient.connect()
.then(()=> console.log("Connected to Redis!"))
.catch(err=>console.error("Redis Connection Error",err));

const slidingWindowRateLimiter = (key, maxRequests, windowMs) => {
  return async (req, res, next) => {
    try {
      const userKey = `${key}:${req.ip}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Multi command to ensure atomic operation
      const multi = redisClient.multi();

      // Remove expired entries
      multi.zRemRangeByScore(userKey, '-inf', windowStart);
      
      // Add current request
      multi.zAdd(userKey, [{
        score: now,
        value: now.toString()
      }]);

      // Get count of requests in window
      multi.zCard(userKey);

      // Set expiration
      multi.expire(userKey, Math.ceil(windowMs / 1000));

      // Execute commands
      const [, , requestCount] = await multi.exec();

      // Add rate limit info to response headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - requestCount),
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      });

      if (requestCount > maxRequests) {
        return res.status(429).json({
          error: "Too many requests",
          retryAfter: Math.ceil(windowMs / 1000),
          rateLimitInfo: {
            limit: maxRequests,
            current: requestCount,
            remaining: 0,
            resetAt: new Date(now + windowMs).toISOString()
          }
        });
      }

      next();
    } catch (error) {
      console.error("Rate Limiter Error:", error);
      // Fail open - allow request if Redis is down
      next();
    }
  };
};

// Add endpoint to check rate limit status
app.get("/rate-limit-status", async (req, res) => {
  try {
    const apiKey = `apiLimiter:${req.ip}`;
    const loginKey = `loginLimiter:${req.ip}`;
    const now = Date.now();

    const [apiCount, loginCount] = await Promise.all([
      redisClient.zCard(apiKey),
      redisClient.zCard(loginKey)
    ]);

    res.json({
      ip: req.ip,
      apiLimiter: {
        limit: 10,
        current: apiCount || 0,
        remaining: Math.max(0, 10 - apiCount),
        windowMs: 120000,
        resetAt: new Date(now + 120000).toISOString()
      },
      loginLimiter: {
        limit: 2,
        current: loginCount || 0,
        remaining: Math.max(0, 2 - loginCount),
        windowMs: 120000,
        resetAt: new Date(now + 120000).toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching rate limit status:", error);
    res.status(500).json({ error: "Error fetching rate limit status" });
  }
});

// Configure rate limiters
const apiLimiter = slidingWindowRateLimiter('apiLimiter', 10, 120000);  // 10 requests per 2 minutes
const loginLimiter = slidingWindowRateLimiter('loginLimiter', 2, 120000); // 2 login attempts per 2 minutes

app.get("/rate/data",apiLimiter,async (req, res) => {
  try {
    // **Check Redis First**
    const cachedUsers = await redisClient.get("users");
    
    if (cachedUsers) {
      console.log("Serving from Redis Cache");
      return res.json({ message: "Data from Redis", data: JSON.parse(cachedUsers) });
    }

    console.log("Fetching from MongoDB...");
    const users = await User.find();

    // **Store Data in Redis for Future Requests (Cache Expiry: 1 Hour)**
    await redisClient.setEx("users", 3600, JSON.stringify(users));

    res.json({ message: "Data from MongoDB", data: users });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/rate/register", [
  check("username", "Username is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { username, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // **Update Redis Cache After New User Registration**
    const users = await User.find();
    
      await redisClient.setEx("users", 3600, JSON.stringify(users));


    res.status(201).json({ message: "User registered successfully!", data: newUser });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/rate/login", loginLimiter,async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

 app.listen(port, () => console.log(`Server running on port ${port}`));
