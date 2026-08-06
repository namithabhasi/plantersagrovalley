import nodemailer from "nodemailer";

/**
 * Sends an email using SMTP credentials from env
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 */
const sendEmail = async ({ to, subject, html }) => {
  // 1. If Resend API Key is defined, send via Resend HTTPS API (bypasses SMTP port blocks on Render free tier)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      console.log("Sending email via Resend API from:", fromEmail);

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `Planters Agro Valley <${fromEmail}>`,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Resend API Error: ${data.message || response.statusText}`);
      }

      console.log("Email sent successfully via Resend. ID:", data.id);
      return;
    } catch (error) {
      console.warn("Resend API failed, falling back to SMTP...", error.message);
    }
  }

  // 2. Fallback to Gmail SMTP (requires EMAIL_USER and EMAIL_PASS)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email credentials are not configured. Please define RESEND_API_KEY or EMAIL_USER/EMAIL_PASS."
    );
  }

  console.log("Sending email via SMTP (Gmail) from:", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 to prevent ENETUNREACH on IPv6-unsupported networks
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
  });

  const mailOptions = {
    from: `"Planters Agro Valley" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully via SMTP.");
};

export default sendEmail;
