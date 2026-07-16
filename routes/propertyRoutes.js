import express from "express";
import upload from "../middleware/upload.js";

import {
  createProperty,
  getProperties,
  getProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// ===============================
// Add Property (Multiple Images)
// ===============================
router.post("/", upload.array("images", 20), createProperty);

// ===============================
// Get All Properties
// ===============================
router.get("/", getProperties);

// ===============================
// Get Single Property
// ===============================
router.get("/:id", getProperty);

// ===============================
// Delete Property
// ===============================
router.delete("/:id", deleteProperty);

export default router;