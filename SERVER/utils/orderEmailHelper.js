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
  console.log(`[MOBILE SMS/NOTIFICATION] Sending SMS to ${phone}: "${message}"`);
  // If an SMS Gateway API key (e.g. FAST2SMS or TWILIO) is configured, trigger here:
  if (process.env.SMS_API_KEY) {
    try {
      console.log(`Triggering SMS Gateway to ${phone}...`);
      // SMS API fetch execution
    } catch (err) {
      console.warn("SMS Gateway dispatch failed:", err.message);
    }
  }
};

