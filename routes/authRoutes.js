import express from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

// Login API
router.post("/login", loginAdmin);

export default router;