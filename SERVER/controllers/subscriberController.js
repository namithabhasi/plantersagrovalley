import Subscriber from "../models/Subscriber.js";
import Coupon from "../models/Coupon.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @desc Subscribe a new email to newsletter (sends welcome email with coupon)
 * @route POST /api/subscribers
 * @access Public
 */
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email: trimmedEmail });
    let isNewSubscription = false;

    if (subscriber) {
      if (subscriber.status === "active") {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed!",
        });
      } else {
        // Resubscribe
        subscriber.status = "active";
        await subscriber.save();
        isNewSubscription = true;
      }
    } else {
      // Create new subscriber
      subscriber = await Subscriber.create({ email: trimmedEmail });
      isNewSubscription = true;
    }

    if (isNewSubscription) {
      // 1. Ensure Welcome Coupon exists in DB
      let welcomeCoupon = await Coupon.findOne({ code: "WELCOME10", isDeleted: false });
      if (!welcomeCoupon) {
        welcomeCoupon = await Coupon.create({
          code: "WELCOME10",
          name: "Welcome Discount",
          description: "10% off for subscribing to our newsletter",
          discountType: "percentage",
          discountValue: 10,
          usageLimit: 0, // Unlimited uses overall
          usagePerUser: 1, // Max 1 use per customer
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000), // 50 years from now
          isActive: true,
        });
        console.log("WELCOME10 coupon created successfully.");
      }

      // 2. Send Welcome Email with Coupon
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #042817; margin: 0; font-size: 28px; font-weight: 700;">Planters Agro Valley</h1>
            <p style="color: #4a5568; margin-top: 5px; font-size: 14px;">Welcome to Our Green Community 🌿</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <div style="color: #2d3748; line-height: 1.6;">
            <p style="font-size: 16px; font-weight: 600;">Hello there,</p>
            <p>Thank you for subscribing to our newsletter! We are thrilled to have you with us. From now on, you'll be the first to hear about our new plant arrivals, gardening events, tips, and exclusive subscriber-only deals.</p>
            
            <div style="background-color: #f7fafc; border: 1px dashed #48bb78; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; font-size: 14px; color: #4a5568; text-transform: uppercase; tracking-wider: 1px;">Your Welcome Gift</p>
              <h2 style="margin: 10px 0; color: #042817; font-size: 32px; font-weight: 800;">10% OFF</h2>
              <p style="margin: 5px 0 15px 0; font-size: 14px; color: #718096;">Use the code below at checkout on your first order:</p>
              <span style="background-color: #042817; color: #ffffff; padding: 10px 20px; font-size: 18px; font-weight: bold; border-radius: 6px; letter-spacing: 2px; display: inline-block;">WELCOME10</span>
            </div>
            
            <p>Happy Gardening!</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 35px 0 20px 0;" />
          <div style="text-align: center; font-size: 12px; color: #a0aec0;">
            <p>&copy; 2026 Planters Agro Valley. All rights reserved.</p>
            <p style="margin-top: 5px;">If you wish to stop receiving these emails, you can contact our support team.</p>
          </div>
        </div>
      `;

      try {
        await sendEmail({
          to: trimmedEmail,
          subject: "Welcome to Planters Agro Valley! 🌿 Here is your welcome gift",
          html: htmlContent,
        });
      } catch (err) {
        console.error("Failed to send welcome email to", trimmedEmail, err);
        // Do not crash the subscription response even if email delivery fails (e.g. invalid email / SMTP configuration issues)
      }
    }

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully! Welcome email sent.",
      subscriber,
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get all subscribers
 * @route GET /api/subscribers/admin
 * @access Private (Admin/Super-Admin)
 */
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete subscriber / unsubscribe by admin
 * @route DELETE /api/subscribers/admin/:id
 * @access Private (Admin/Super-Admin)
 */
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Subscriber Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Send newsletter to all active subscribers
 * @route POST /api/subscribers/admin/send-newsletter
 * @access Private (Admin/Super-Admin)
 */
export const sendBulkNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required.",
      });
    }

    const activeSubscribers = await Subscriber.find({ status: "active" });

    if (activeSubscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active subscribers to send email to.",
        sentCount: 0,
      });
    }

    // Format content as premium newsletter HTML
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #042817; margin: 0; font-size: 28px; font-weight: 700;">Planters Agro Valley</h1>
          <p style="color: #4a5568; margin-top: 5px; font-size: 14px;">Special Subscriber Newsletter 🌿</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
        <div style="color: #2d3748; line-height: 1.6; font-size: 15px;">
          ${content.replace(/\n/g, "<br/>")}
        </div>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 35px 0 20px 0;" />
        <div style="text-align: center; font-size: 12px; color: #a0aec0;">
          <p>&copy; 2026 Planters Agro Valley. All rights reserved.</p>
          <p style="margin-top: 5px;">You received this email because you are subscribed to Planters Agro Valley.</p>
        </div>
      </div>
    `;

    // Send emails in parallel
    const emailPromises = activeSubscribers.map((subscriber) =>
      sendEmail({
        to: subscriber.email,
        subject: subject,
        html: htmlTemplate,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successfulSends = results.filter((r) => r.status === "fulfilled").length;
    const failedSends = results.filter((r) => r.status === "rejected").length;

    console.log(`Newsletter sent: ${successfulSends} succeeded, ${failedSends} failed.`);

    return res.status(200).json({
      success: true,
      message: `Newsletter sent successfully to ${successfulSends} subscribers.`,
      sentCount: successfulSends,
      failedCount: failedSends,
    });
  } catch (error) {
    console.error("Send Bulk Newsletter Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
