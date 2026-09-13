import sendEmail from "./sendEmail.js";

/**
 * Sends a confirmation email to the customer containing order summary and tracking ID (Order Number)
 * @param {Object} order - The saved Order document
 * @param {Object} user - The user document or object (must contain email and firstName)
 */
export const sendOrderTrackingEmail = async (order, user) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const trackingLink = `${frontendUrl}/track-order`;

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold; color: #333;">${item.name}</div>
            <div style="font-size: 12px; color: #666;">Qty: ${item.quantity} x ₹${item.price}</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #333;">
            ₹${item.subtotal}
          </td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #06492D; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Planters Agro Valley</h1>
          <p style="color: #e2f0d9; margin: 5px 0 0 0; font-size: 14px;">Order Placed Successfully!</p>
        </div>

        <!-- Body -->
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="color: #06492D; font-size: 18px; margin-top: 0;">Hi ${user.firstName || 'Customer'},</h2>
          <p style="color: #555555; line-height: 1.5; font-size: 14px;">
            Thank you for shopping with us! Your order has been placed successfully and is now being processed. 
            You can use the Tracking ID / Order Number below to track your order status on our website.
          </p>

          <!-- Tracking Info Box -->
          <div style="background-color: #f7faf7; border-left: 4px solid #06492D; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-size: 13px; color: #666; padding: 2px 0;"><strong>Tracking ID / Order Number:</strong></td>
                <td style="font-size: 14px; font-family: monospace; color: #06492D; font-weight: bold; padding: 2px 0; text-align: right;">
                  ${order.orderNumber}
                </td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #666; padding: 2px 0;"><strong>Payment Method:</strong></td>
                <td style="font-size: 13px; color: #333; padding: 2px 0; text-align: right;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #666; padding: 2px 0;"><strong>Payment Status:</strong></td>
                <td style="font-size: 13px; color: #333; padding: 2px 0; text-align: right;">${order.paymentStatus}</td>
              </tr>
            </table>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingLink}" style="background-color: #06492D; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
              Track Your Order
            </a>
          </div>

          <!-- Order Summary -->
          <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 30px; font-size: 16px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #fcfcfc;">
                <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: left; font-size: 13px; color: #666;">Items</th>
                <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right; font-size: 13px; color: #666;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px 10px 5px 10px; text-align: right; font-size: 13px; color: #666;">Subtotal:</td>
                <td style="padding: 10px 10px 5px 10px; text-align: right; font-size: 13px; color: #333; font-weight: bold;">₹${order.subtotal}</td>
              </tr>
              ${
                order.discountAmount > 0
                  ? `
              <tr>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #666;">Discount:</td>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #d9534f; font-weight: bold;">-₹${order.discountAmount}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #666;">Tax:</td>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #333;">₹${order.tax}</td>
              </tr>
              <tr>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #666;">Shipping Charge:</td>
                <td style="padding: 5px 10px; text-align: right; font-size: 13px; color: #333;">₹${order.shippingCharge}</td>
              </tr>
              <tr style="background-color: #f7faf7;">
                <td style="padding: 10px; text-align: right; font-size: 14px; font-weight: bold; color: #06492D; border-top: 1px solid #ddd;">Total Paid:</td>
                <td style="padding: 10px; text-align: right; font-size: 15px; font-weight: bold; color: #06492D; border-top: 1px solid #ddd;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Shipping Details -->
          <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 30px; font-size: 16px;">Shipping Address</h3>
          <div style="font-size: 13px; color: #555; line-height: 1.6; background-color: #fafafa; padding: 15px; border-radius: 4px;">
            <strong>${order.shippingAddress.receiverName}</strong><br/>
            ${order.shippingAddress.addressLine1}${
              order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""
            }<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
            ${order.shippingAddress.country}<br/>
            <strong>Phone:</strong> ${order.shippingAddress.phone}
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0;">If you have any questions, reply to this email or contact us at <a href="mailto:${
            process.env.EMAIL_USER || "strivoc@gmail.com"
          }" style="color: #06492D; text-decoration: none;">${process.env.EMAIL_USER || "strivoc@gmail.com"}</a></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    `;

    console.log(`Sending order placement confirmation/tracking email for Order #${order.orderNumber} to ${user.email}`);

    await sendEmail({
      to: user.email,
      subject: `Your Planters Agro Valley Order Confirmation - #${order.orderNumber}`,
      html: htmlContent,
    });

    // Also trigger mobile SMS/Notification log if customer mobile number exists
    if (user.phone || order.shippingAddress?.phone) {
      notifyCustomerMobile(
        user.phone || order.shippingAddress?.phone,
        `Planters Agro Valley: Order #${order.orderNumber} confirmed! Tracking details sent to your registered email.`
      );
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

/**
 * Sends a profile/address update notification email to the customer
 * @param {Object} user - User document with updated details
 */
export const sendProfileUpdateEmail = async (user) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const profileLink = `${frontendUrl}/profile`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #06492D; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Planters Agro Valley</h1>
          <p style="color: #e2f0d9; margin: 5px 0 0 0; font-size: 14px;">Profile & Address Updated</p>
        </div>

        <!-- Body -->
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="color: #06492D; font-size: 18px; margin-top: 0;">Hi ${user.firstName || 'Customer'},</h2>
          <p style="color: #555555; line-height: 1.5; font-size: 14px;">
            Your account profile and delivery address details have been successfully updated on Planters Agro Valley.
          </p>

          <!-- Address Summary Box -->
          <div style="background-color: #f7faf7; border-left: 4px solid #06492D; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #06492D;">Updated Delivery Address</h3>
            <p style="margin: 0; font-size: 13px; color: #444; line-height: 1.6;">
              <strong>${user.firstName} ${user.lastName || ''}</strong><br/>
              ${user.address || 'Address not updated'}${user.apartment ? `, ${user.apartment}` : ''}<br/>
              ${user.city || ''}${user.city && user.state ? ', ' : ''}${user.state || ''} ${user.pincode ? `- ${user.pincode}` : ''}<br/>
              ${user.country || 'India'}<br/>
              <strong>Phone:</strong> ${user.phone || 'Not provided'}
            </p>
          </div>

          <p style="color: #777; font-size: 13px; line-height: 1.5;">
            Having accurate address details ensures smooth and timely delivery of your plant orders. If you did not initiate this change, please contact our support immediately.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${profileLink}" style="background-color: #06492D; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
              View Your Profile
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0;">If you have any questions, reply to this email or contact support at <a href="mailto:${process.env.EMAIL_USER || "strivoc@gmail.com"}" style="color: #06492D; text-decoration: none;">${process.env.EMAIL_USER || "strivoc@gmail.com"}</a></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    `;

    console.log(`Sending profile/address update notification email to ${user.email}`);

    await sendEmail({
      to: user.email,
      subject: `Account Profile & Address Updated - Planters Agro Valley`,
      html: htmlContent,
    });

    if (user.phone) {
      notifyCustomerMobile(
        user.phone,
        `Planters Agro Valley: Your profile and delivery address details have been updated successfully.`
      );
    }
  } catch (error) {
    console.error("Error sending profile update email:", error);
  }
};

/**
 * Sends a welcome email to newly registered customers, prompting them to add complete address
 * @param {Object} user - User document
 */
export const sendWelcomeEmail = async (user) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const profileLink = `${frontendUrl}/profile?editAddress=true`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #06492D; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Planters Agro Valley</h1>
          <p style="color: #e2f0d9; margin: 5px 0 0 0; font-size: 14px;">Welcome to Planters Agro Valley!</p>
        </div>

        <!-- Body -->
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="color: #06492D; font-size: 18px; margin-top: 0;">Welcome, ${user.firstName || 'Valued Customer'}! 🌱</h2>
          <p style="color: #555555; line-height: 1.5; font-size: 14px;">
            Thank you for creating an account with Planters Agro Valley! We are thrilled to help you build your green haven.
          </p>

          <!-- Action Box -->
          <div style="background-color: #f7faf7; border-left: 4px solid #06492D; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #06492D;">Update address for smooth delivery</h3>
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
              Please take a moment to update your complete delivery address in your profile. Adding your complete address now ensures lightning-fast checkout and smooth plant delivery!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${profileLink}" style="background-color: #06492D; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
              Update Address in My Profile
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0;">Contact us at <a href="mailto:${process.env.EMAIL_USER || "strivoc@gmail.com"}" style="color: #06492D; text-decoration: none;">${process.env.EMAIL_USER || "strivoc@gmail.com"}</a></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    `;

    console.log(`Sending welcome email to newly registered customer: ${user.email}`);

    await sendEmail({
      to: user.email,
      subject: `Welcome to Planters Agro Valley - Complete Your Profile for Smooth Delivery!`,
      html: htmlContent,
    });

    if (user.phone) {
      notifyCustomerMobile(
        user.phone,
        `Welcome to Planters Agro Valley! Update your address in My Profile for smooth delivery.`
      );
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

/**
 * Mobile SMS / Notification helper (logs SMS alert & supports gateway trigger if env is defined)
 * @param {string} phone 
 * @param {string} message 
 */
export const notifyCustomerMobile = async (phone, message) => {
  if (!phone) return;
  const cleanPhone = phone.trim().replace(/\s+/g, "");

  console.log(`[MOBILE SMS DISPATCH] Recipient: ${cleanPhone} | Content: "${message}"`);

  // Extract 6-digit OTP code if message contains OTP
  const otpMatch = message.match(/\b\d{6}\b/);
  const otpCode = otpMatch ? otpMatch[0] : null;

  // 1. Fast2SMS Integration (Fast & affordable SMS gateway for Indian numbers)
  const rawKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
  const fast2smsKey = rawKey ? rawKey.replace(/['"]/g, "").trim() : "";

  if (fast2smsKey) {
    try {
      // Strip leading '+' or '91' for Fast2SMS Indian 10-digit API requirement
      const indianNumber = cleanPhone.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);

      if (indianNumber.length === 10) {
        console.log(`Triggering Fast2SMS API for ${indianNumber}...`);

        let res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            "authorization": fast2smsKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            otpCode
              ? { route: "otp", variables_values: otpCode, numbers: indianNumber }
              : { route: "q", message: message, language: "english", flash: "0", numbers: indianNumber }
          )
        });

        let resData = await res.json();
        if (!resData.return) {
          console.warn(`[Fast2SMS ALERT] API response error (${resData.status_code || "FAIL"}): ${resData.message || JSON.stringify(resData)}`);
        } else {
          console.log(`[Fast2SMS SUCCESS] SMS dispatched to ${indianNumber}:`, resData);
        }
      }
    } catch (err) {
      console.warn("Fast2SMS Dispatch Error:", err.message);
    }
  }

  // 2. Twilio Integration (Global International SMS gateway)
  const twilioSid = (process.env.TWILIO_ACCOUNT_SID || "").replace(/['"]/g, "").trim();
  const twilioAuthToken = (process.env.TWILIO_AUTH_TOKEN || "").replace(/['"]/g, "").trim();
  const twilioPhone = (process.env.TWILIO_PHONE_NUMBER || "").replace(/['"]/g, "").trim();

  if (twilioSid && twilioAuthToken && twilioPhone) {
    try {
      console.log(`Triggering Twilio API for ${cleanPhone}...`);
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = `Basic ` + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");

      const params = new URLSearchParams();
      params.append("To", cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`);
      params.append("From", twilioPhone);
      params.append("Body", message);

      const res = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const resData = await res.json();
      console.log("Twilio Response:", resData?.sid ? `Sent SID: ${resData.sid}` : resData);
    } catch (err) {
      console.warn("Twilio Dispatch Error:", err.message);
    }
  }
};

/**
 * Sends a password reset email to the user with a token link
 * @param {Object} user - User document
 * @param {string} resetUrl - The full reset URL
 */
export const sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #06492D; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Planters Agro Valley</h1>
          <p style="color: #e2f0d9; margin: 5px 0 0 0; font-size: 14px;">Password Reset Request</p>
        </div>

        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="color: #06492D; font-size: 18px; margin-top: 0;">Hi ${user.firstName || 'Customer'},</h2>
          <p style="color: #555555; line-height: 1.5; font-size: 14px;">
            You are receiving this email because you (or someone else) requested a password reset for your account on Planters Agro Valley.
          </p>

          <div style="background-color: #f7faf7; border-left: 4px solid #06492D; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
              Please click the button below to reset your password. This link will remain valid for <strong>1 hour</strong>.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #06492D; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
              Reset Password Now
            </a>
          </div>

          <p style="color: #777; font-size: 12px; line-height: 1.5;">
            If you did not request this, please ignore this email and your password will remain unchanged.
          </p>

          <p style="color: #999; font-size: 11px; word-break: break-all; margin-top: 20px;">
            If the button above does not work, copy and paste the following link into your browser:<br/>
            <a href="${resetUrl}" style="color: #06492D;">${resetUrl}</a>
          </p>
        </div>

        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0;">Contact support at <a href="mailto:${process.env.EMAIL_USER || "strivoc@gmail.com"}" style="color: #06492D; text-decoration: none;">${process.env.EMAIL_USER || "strivoc@gmail.com"}</a></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - Planters Agro Valley",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Sends a 6-digit OTP verification email to the user
 * @param {string} email - Destination email address
 * @param {string} otpCode - 6-digit OTP string
 * @param {string} purpose - Purpose description
 */
export const sendOTPEmail = async (email, otpCode, purpose = "Verification") => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #06492D; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Planters Agro Valley</h1>
          <p style="color: #e2f0d9; margin: 5px 0 0 0; font-size: 14px;">${purpose} OTP Code</p>
        </div>

        <div style="padding: 25px; background-color: #ffffff; text-align: center;">
          <p style="color: #555555; line-height: 1.5; font-size: 14px; margin-top: 0;">
            Use the following 6-digit OTP code to complete your <strong>${purpose}</strong>.
          </p>

          <div style="background-color: #f7faf7; border: 2px dashed #06492D; padding: 20px; margin: 25px auto; max-width: 250px; border-radius: 6px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #06492D; font-family: monospace;">
              ${otpCode}
            </span>
          </div>

          <p style="color: #777; font-size: 12px; line-height: 1.5;">
            This OTP code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0;">Contact support at <a href="mailto:${process.env.EMAIL_USER || "strivoc@gmail.com"}" style="color: #06492D; text-decoration: none;">${process.env.EMAIL_USER || "strivoc@gmail.com"}</a></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Your ${purpose} OTP Code - ${otpCode}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};



