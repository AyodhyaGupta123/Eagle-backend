import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

dotenv.config();

const app = express();

// ========================
// Database Connection
// ========================
connectDB();

// ========================
// Middleware
// ========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://eagle-nt3o-git-main-ayodhya-guptas-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// Uploads Folder
// ========================
const uploadPath = path.join(process.cwd(), "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Serve Static Images
app.use("/uploads", express.static(uploadPath));

// ========================
// Debug Uploads
// ========================
app.get("/debug/uploads", (req, res) => {
  res.json({
    cwd: process.cwd(),
    uploadPath,
    exists: fs.existsSync(uploadPath),
    files: fs.existsSync(uploadPath)
      ? fs.readdirSync(uploadPath)
      : [],
  });
});

// ========================
// API Routes
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);

// ========================
// Health Check
// ========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Eagle Backend is Running",
  });
});

// ========================
// 404 Route
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ========================
// Global Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ========================
// Server
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});