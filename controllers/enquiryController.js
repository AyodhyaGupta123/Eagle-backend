import Enquiry from "../models/Enquiry.js";
import resend from "../config/resend.js";

// HTML injection se bachne ke liye
const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

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

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();
    const cleanCountry = country?.trim() || "";
    const cleanCountryCode = countryCode?.trim() || "";
    const cleanProductName = productName?.trim() || "";

    const enquiry = await Enquiry.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      countryCode: cleanCountryCode,
      country: cleanCountry,
      message: cleanMessage,
      productId: productId || null,
      productName: cleanProductName,
    });

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Eagle Incense Sticks <onboarding@resend.dev>";

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL is missing in environment variables");
    }

    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safePhone = escapeHtml(cleanPhone);
    const safeCountryCode = escapeHtml(cleanCountryCode);
    const safeCountry = escapeHtml(cleanCountry);
    const safeMessage = escapeHtml(cleanMessage);
    const safeProductName = escapeHtml(cleanProductName);

    /*
     * Admin email aur customer confirmation email parallel mein send honge.
     * Promise.allSettled use kiya hai taaki ek email fail hone par
     * doosri email aur enquiry submission fail na ho.
     */
    const emailTasks = [];

    if (adminEmail) {
      emailTasks.push(
        resend.emails.send({
          from: fromEmail,
          to: [adminEmail],
          replyTo: cleanEmail,

          subject: cleanProductName
            ? `New Quote Request - ${cleanProductName}`
            : "New Website Enquiry",

          html: `
            <div style="
              max-width:650px;
              margin:0 auto;
              padding:24px;
              font-family:Arial,sans-serif;
              background:#f6f6f6;
            ">
              <div style="
                padding:28px;
                background:#ffffff;
                border-radius:10px;
                border:1px solid #eeeeee;
              ">
                <h2 style="margin-top:0;color:#222;">
                  New Website Enquiry
                </h2>

                <p>
                  <strong>Name:</strong>
                  ${safeName}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${safeEmail}
                </p>

                <p>
                  <strong>Phone:</strong>
                  ${safeCountryCode} ${safePhone}
                </p>

                <p>
                  <strong>Country:</strong>
                  ${safeCountry || "Not provided"}
                </p>

                ${
                  safeProductName
                    ? `
                      <p>
                        <strong>Product:</strong>
                        ${safeProductName}
                      </p>
                    `
                    : ""
                }

                <div style="
                  margin-top:20px;
                  padding:16px;
                  background:#f5efe3;
                  border-radius:8px;
                ">
                  <strong>Message:</strong>

                  <p style="
                    margin-bottom:0;
                    white-space:pre-line;
                    line-height:1.6;
                  ">
                    ${safeMessage}
                  </p>
                </div>

                <p style="margin-top:20px;color:#666;">
                  <strong>Enquiry ID:</strong>
                  ${enquiry._id}
                </p>
              </div>
            </div>
          `,
        }),
      );
    }

    emailTasks.push(
      resend.emails.send({
        from: fromEmail,
        to: [cleanEmail],
        replyTo: adminEmail || "info@eagleincensesticks.com",

        subject: cleanProductName
          ? "We received your quote request"
          : "We received your enquiry",

        html: `
          <div style="
            max-width:650px;
            margin:0 auto;
            padding:24px;
            font-family:Arial,sans-serif;
            background:#f6f6f6;
          ">
            <div style="
              padding:28px;
              background:#ffffff;
              border-radius:10px;
              border:1px solid #eeeeee;
            ">
              <h2 style="margin-top:0;color:#222;">
                Hello ${safeName},
              </h2>

              <p>
                Thank you for contacting Eagle Incense Sticks.
              </p>

              ${
                safeProductName
                  ? `
                    <p>
                      We received your quote request for
                      <strong>${safeProductName}</strong>.
                    </p>
                  `
                  : `
                    <p>
                      We received your enquiry successfully.
                    </p>
                  `
              }

              <p>
                Our team will contact you within 24 hours.
              </p>

              <div style="
                margin-top:20px;
                padding:16px;
                background:#f5efe3;
                border-radius:8px;
              ">
                <strong>Your Message:</strong>

                <p style="
                  margin-bottom:0;
                  white-space:pre-line;
                  line-height:1.6;
                ">
                  ${safeMessage}
                </p>
              </div>

              <p style="margin-top:30px;line-height:1.7;">
                Regards,<br />
                <strong>Eagle Incense Sticks</strong><br />
                +91 9981997440<br />
                info@eagleincensesticks.com
              </p>
            </div>
          </div>
        `,
      }),
    );

    const emailResults = await Promise.allSettled(emailTasks);

    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Email ${index + 1} failed:`, result.reason);
        return;
      }

      if (result.value?.error) {
        console.error(
          `Resend email ${index + 1} error:`,
          result.value.error,
        );
      } else {
        console.log(
          `Resend email ${index + 1} sent:`,
          result.value?.data?.id,
        );
      }
    });

    const emailsSentSuccessfully = emailResults.every(
      (result) =>
        result.status === "fulfilled" &&
        !result.value?.error,
    );

    return res.status(201).json({
      success: true,
      message: "Enquiry Submitted Successfully",
      emailSent: emailsSentSuccessfully,
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
    console.error("Get enquiries error:", error);

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
    console.error("Get enquiry error:", error);

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
    console.error("Delete enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};