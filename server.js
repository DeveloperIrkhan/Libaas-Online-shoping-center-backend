import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/auth.routers.js";
import { connectionDb } from "./config/db.connection.js";
import cookieParser from "cookie-parser";
// App config

const app = express();
const port = process.env.PORT || 4000;

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
//database connection
connectionDb();

// API endpoints
app.get("/", (req, res) => {
  res.send("API is working.");
});

//routers declarations
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
