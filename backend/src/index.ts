import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize() 
  .then(() => {
    console.log("Database connected via TypeORM successfully!");
    app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));
  })
  .catch((error) => console.log("Database connection error: ", error));