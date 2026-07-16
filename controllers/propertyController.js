import Property from "../models/Property.js";

// ===================================
// Add Property
// ===================================
export const createProperty = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    // Validation
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and Price are required.",
      });
    }

    // Uploaded Images
    const fileImages = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // External Image URLs
    let urlImages = [];

    if (req.body.imageUrls) {
      try {
        const parsed =
          typeof req.body.imageUrls === "string"
            ? JSON.parse(req.body.imageUrls)
            : req.body.imageUrls;

        if (Array.isArray(parsed)) {
          urlImages = parsed
            .map((url) => url.trim())
            .filter(Boolean);
        }
      } catch (err) {
        console.warn("Invalid imageUrls payload:", err.message);
      }
    }

    const images = [...fileImages, ...urlImages];

    // Create Property
    const property = await Property.create({
      title: title.trim(),
      price: Number(price),
      description: description?.trim() || "",
      images,

      // Default values for remaining schema fields
      category: null,
      location: "",
      address: "",
      googleMap: "",

      ownerName: "",
      phone: "",
      email: "",

      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,

      features: [],
      featured: false,
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Property Added Successfully",
      property,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get All Properties
// ===================================
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get Single Property
// ===================================
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    return res.json({
      success: true,
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Delete Property
// ===================================
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    await property.deleteOne();

    return res.json({
      success: true,
      message: "Property Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};