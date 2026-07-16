import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit();
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create Admin
    await Admin.create({
      username: "admin",
      password: hashedPassword,
    });

    console.log("✅ Admin Created Successfully");
    console.log("Username: admin");
    console.log("Password: admin123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();