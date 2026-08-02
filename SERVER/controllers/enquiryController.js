import Enquiry from "../models/Enquiry.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @desc Create a new contact enquiry
 * @route POST /api/enquiries
 * @access Public
 */
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, comment } = req.body;

    if (!name || !email || !phone || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Create Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get all contact enquiries
 * @route GET /api/enquiries
 * @access Private (Admin/Super-Admin)
 */
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Get Enquiries Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update enquiry status
 * @route PATCH /api/enquiries/:id/status
 * @access Private (Admin/Super-Admin)
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Update Enquiry Status Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete enquiry
 * @route DELETE /api/enquiries/:id
 * @access Private (Admin/Super-Admin)
 */
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Reply to an enquiry via email
 * @route POST /api/enquiries/:id/reply
 * @access Private (Admin/Super-Admin)
 */
export const replyEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    // Format HTML email message
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #06492D;">Planters Agro Valley Response</h2>
        <p>Dear ${enquiry.name},</p>
        <p>Thank you for reaching out to us. Below is our response to your inquiry:</p>
        <div style="background-color: #fcfcfc; padding: 15px; border-left: 4px solid #06492D; margin: 20px 0; font-style: italic;">
          "${enquiry.comment}"
        </div>
        <div style="line-height: 1.6; color: #333; margin-top: 20px;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777;">
          Best regards,<br/>
          <strong>Planters Agro Valley Team</strong><br/>
          <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
        </p>
      </div>
    `;

    // Send email using utility
    await sendEmail({
      to: enquiry.email,
      subject: subject,
      html: htmlContent,
    });

    // Mark enquiry as replied
    enquiry.status = "replied";
    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Reply email sent successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Reply Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
