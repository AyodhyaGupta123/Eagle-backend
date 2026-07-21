import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import transporter from "./config/mailer.js";

import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ========================
// Database Connection
// ========================
connectDB();  

transporter
  .verify()
  .then(() => {
    console.log("✅ Hostinger SMTP Connected Successfully");
  })
  .catch((error) => {
    console.error("❌ SMTP Connection Failed:", error.message);
  });


app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// ========================
// Middleware
// ========================
app.use(
  cors({
    origin: [
      "https://eagleincensesticks.com",
      "https://www.eagleincensesticks.com",
      "https://admin.eagleincensesticks.com",
      "https://eagle-nt3o-git-main-ayodhya-guptas-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================
// API Routes
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/newsletter", newsletterRoutes);

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
