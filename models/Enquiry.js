import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "enquiries",
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;