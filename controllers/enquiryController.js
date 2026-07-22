import Enquiry from "../models/Enquiry.js";
import transporter from "../config/mailer.js";

// Create Enquiry
export const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      countryCode,
      country,
      message,
      productId,
      productName,
    } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and message are required",
      });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      countryCode: countryCode || "",
      country: country || "",
      message: message.trim(),
      productId: productId || null,
      productName: productName || "",
    });

    // Admin ko enquiry email
    await transporter.sendMail({
      from: `"Eagle Incense Sticks" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: productName
        ? `New Quote Request - ${productName}`
        : "New Website Enquiry",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>New Website Enquiry</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country || "Not provided"}</p>

          ${
            productName
              ? `<p><strong>Product:</strong> ${productName}</p>`
              : ""
          }

          <p><strong>Message:</strong></p>
          <p>${message}</p>

          <p><strong>Enquiry ID:</strong> ${enquiry._id}</p>
        </div>
      `,
    });

    // Customer ko confirmation email
    await transporter.sendMail({
      from: `"Eagle Incense Sticks" <${process.env.SMTP_USER}>`,
      to: email,
      subject: productName
        ? "We received your quote request"
        : "We received your enquiry",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>Hello ${name},</h2>

          <p>Thank you for contacting Eagle Incense Sticks.</p>

          ${
            productName
              ? `<p>We received your quote request for <strong>${productName}</strong>.</p>`
              : `<p>We received your enquiry successfully.</p>`
          }

          <p>Our team will contact you within 24 hours.</p>

          <div style="background:#f5efe3;padding:15px;border-radius:8px;margin-top:20px;">
            <strong>Your Message:</strong>
            <p>${message}</p>
          </div>

          <p style="margin-top:30px;">
            Regards,<br />
            <strong>Eagle Incense Sticks</strong><br />
            +91 9981997440<br />
            info@eagleincensesticks.com
          </p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry Submitted Successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit enquiry",
    });
  }
};

// Get All Enquiries
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Enquiry
export const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};