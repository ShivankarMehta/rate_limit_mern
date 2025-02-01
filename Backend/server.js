import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 
import cors from "cors";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";


const app=express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})  
            .then(()=>console.log("MongoDB Connected"))
            .catch(err=>console.error(err));
            
const port=process.env.PORT || 5000;

//Basic Rate Limiting (100 requests per 15 min per IP)
const apiLimiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:100, //Max request per IP
    message:{error:"Too many requests,please try again later."}
});

app.use(apiLimiter);


const loginLimiter=rateLimit({
    windowMs:60*60*1000,
    max:100,
    message:{"error":"Too many login requests,please try again later."}
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 5 requests per hour
    message: { error: "Too many sign-up attempts. Try again later." },
  });

const UserSchema=new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const User=mongoose.model("User",UserSchema);

app.post("/rate/register",registerLimiter, [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
  ],async(req,res)=>{

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
   const {username,email,password}=req.body;

    try{
        let existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }


        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser= new User({
            username,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        res.status(201).json({message:"User registered successfully!",data:newUser});
    }
    catch(error){
        res.status(500).json({error:"Server error"});
    }
})

app.post("/rate/login",loginLimiter,async(req,res)=>{
    const {username,password}=req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
    
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
    
        res.json({ message: "Login successful" });
    
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
})

app.get("/rate/data",async (req,res)=>{
    try{
    const users=await User.find();
    res.json({message:"This is rate-limited data.", data: users,})
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Server error" });
      }
});

app.listen(port, () => console.log(`Server running on port ${port}`));