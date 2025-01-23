import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import { connectionDb } from "./config/db.connection.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.routes.js";
import categoryRoute from "./routes/category.routes.js";
import SubCategoryRoute from "./routes/subCategory.router.js";
// App config

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    // origin: "http://localhost:5173",
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
//database connection
connectionDb();

// API endpoints
app.get("/", (req, res) => {
  res.send("API is working.");
});

//routes declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", SubCategoryRoute);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
