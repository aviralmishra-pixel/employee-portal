import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";

const app = express();

// Initialize Redis Client and connect to Redis server
export const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect().then(() => console.log("Connected to Redis"));
 
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,               // Allows cookies/tokens to pass through
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize() 
  .then(() => {
    console.log("Database connected via TypeORM successfully!");
    app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));
  })
  .catch((error) => console.log("Database connection error: ", error));
