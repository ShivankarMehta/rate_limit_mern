import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // MySQL Host
  user: process.env.DB_USER, // MySQL Username
  password: process.env.DB_PASS, // MySQL Password
  database: process.env.DB_NAME, // Database Name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
