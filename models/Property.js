import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // ==========================
    // Basic Details
    // ==========================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Images
    // ==========================
    images: [
      {
        type: String,
      },
    ],

    // ==========================
    // Optional Fields
    // ==========================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    googleMap: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Owner Details
    // ==========================
    ownerName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    // ==========================
    // Property Details
    // ==========================
    area: {
      type: Number,
      default: 0,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    parking: {
      type: Number,
      default: 0,
    },

    features: [
      {
        type: String,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);