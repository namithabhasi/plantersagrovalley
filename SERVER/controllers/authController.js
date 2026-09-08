import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendWelcomeEmail, sendProfileUpdateEmail, sendPasswordResetEmail, sendOTPEmail, notifyCustomerMobile } from "../utils/orderEmailHelper.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

/**
 * @desc Register User
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role: "customer",
    });

    // Send welcome email asking user to complete delivery address
    sendWelcomeEmail(user);

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Save JWT in cookie
    res.cookie("token", token, cookieOptions);

    // Remove password before sending response
    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Login User
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (include password)
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Save cookie
    res.cookie("token", token, cookieOptions);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Logout User
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", clearCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Google Login / Register
 * @route POST /api/auth/google
 * @access Public
 */
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required.",
      });
    }

    // Call Google tokeninfo endpoint to verify token integrity
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Failed to verify Google token.",
      });
    }

    const payload = await response.json();

    // Verify audience matches our Google Client ID if it is configured
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && payload.aud !== clientId) {
      return res.status(400).json({
        success: false,
        message: "Google token client ID mismatch.",
      });
    }

    const email = payload.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Google account.",
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create user since they do not exist
      const firstName = payload.given_name || payload.name || "GoogleUser";
      const lastName = payload.family_name || "User";
      // Generate a secure random password to satisfy model requirements
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";

      user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: randomPassword,
        phone: "",
        isVerified: true,
        role: "customer",
      });

      sendWelcomeEmail(user);
    }

    // Generate JWT
    const jwtToken = generateToken(user._id, user.role);

    // Save JWT in cookie
    res.cookie("token", jwtToken, cookieOptions);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Google sign-in successful.",
      token: jwtToken,
      user: userData,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Current Logged-in User
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * @desc Update User Profile & Delivery Address
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      address,
      apartment,
      city,
      state,
      pincode,
      country,
      profileImage,
    } = req.body;

    if (phone !== undefined && phone.trim() !== "") {
      const cleanPhone = phone.trim();
      const existingUserWithPhone = await User.findOne({
        phone: cleanPhone,
        _id: { $ne: req.user._id },
      });

      if (existingUserWithPhone) {
        return res.status(400).json({
          success: false,
          message: "Mobile number is already registered with another account.",
        });
      }
      user.phone = cleanPhone;
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (address !== undefined) user.address = address;
    if (apartment !== undefined) user.apartment = apartment;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;
    if (country !== undefined) user.country = country;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    // Trigger email notification for profile & address update
    sendProfileUpdateEmail(userData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Forgot Password - Request Reset Link
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email address.",
      });
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token for storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour

    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user, resetUrl);

      return res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email.",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Reset Password using Token
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Hash token from URL param to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Set new password (pre-save hook in User model will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Send OTP to Phone Number for Login
 * @route POST /api/auth/send-phone-otp
 * @access Public
 */
export const sendPhoneOTP = async (req, res) => {
  try {
    const { phone, isRegister } = req.body;

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number.",
      });
    }

    const cleanPhone = phone.trim();
    const digits = cleanPhone.replace(/\D/g, "");

    if (!digits || digits.length < 7 || digits.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number (7 to 15 digits).",
      });
    }

    const phoneVariants = [cleanPhone, digits, `+${digits}`];
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      phoneVariants.push(last10, `+91${last10}`);
    }

    // Find customer account
    let user = await User.findOne({ phone: { $in: phoneVariants } });

    if (!user) {
      if (!isRegister) {
        return res.status(404).json({
          success: false,
          message: "Mobile number is not registered. Please sign up first.",
        });
      }

      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const fallbackEmail = `${digits}@phone.planters.com`;

      user = await User.create({
        firstName: "User",
        lastName: digits.slice(-4),
        email: fallbackEmail,
        password: randomPassword,
        phone: cleanPhone,
        role: "customer",
        isVerified: true,
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otpCode).digest("hex");

    user.otp = {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    await user.save({ validateBeforeSave: false });

    // Console Log for developer/local testing visibility
    console.log(`\n========================================`);
    console.log(`[OTP LOG] Mobile Login OTP for ${cleanPhone}: ${otpCode}`);
    console.log(`========================================\n`);

    // Dispatch SMS notification / gateway
    notifyCustomerMobile(
      cleanPhone,
      `Your Planters Agro Valley login OTP is ${otpCode}. Valid for 10 minutes.`
    );

    // If user has a real email, also email OTP
    if (user.email && !user.email.endsWith("@phone.planters.com")) {
      sendOTPEmail(user.email, otpCode, "Sign-In Verification").catch((err) =>
        console.error("OTP Email send fail:", err.message)
      );
    }

    return res.status(200).json({
      success: true,
      message: `OTP code sent successfully to ${cleanPhone}.`,
    });
  } catch (error) {
    console.error("Send Phone OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Verify Phone OTP & Log User In
 * @route POST /api/auth/verify-phone-otp
 * @access Public
 */
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP code are required.",
      });
    }

    const cleanPhone = phone.trim();
    const digits = cleanPhone.replace(/\D/g, "");
    const phoneVariants = [cleanPhone, digits, `+${digits}`];
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      phoneVariants.push(last10, `+91${last10}`);
    }

    const hashedOTP = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    const user = await User.findOne({
      phone: { $in: phoneVariants },
      "otp.code": hashedOTP,
      "otp.expiresAt": { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new OTP.",
      });
    }

    // Clear OTP
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate JWT & cookie
    const token = generateToken(user._id, user.role);
    res.cookie("token", token, cookieOptions);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Verify Phone OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Send Reset OTP (to Email or Phone)
 * @route POST /api/auth/send-reset-otp
 * @access Public
 */
export const sendResetOTP = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address or mobile number.",
      });
    }

    const clean = identifier.trim().toLowerCase();
    const digits = clean.replace(/\D/g, "");
    const queryConditions = [{ email: clean }];

    if (digits.length >= 7) {
      const phoneVariants = [clean, digits, `+${digits}`];
      if (digits.length >= 10) {
        const last10 = digits.slice(-10);
        phoneVariants.push(last10, `+91${last10}`);
      }
      queryConditions.push({ phone: { $in: phoneVariants } });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: queryConditions,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found matching that email address or mobile number.",
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otpCode).digest("hex");

    user.otp = {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await user.save({ validateBeforeSave: false });

    console.log(`\n========================================`);
    console.log(`[OTP LOG] Password Reset OTP for ${clean}: ${otpCode}`);
    console.log(`========================================\n`);

    // Dispatch SMS if user has phone
    if (user.phone) {
      notifyCustomerMobile(
        user.phone,
        `Your Planters Agro Valley Password Reset OTP code is ${otpCode}. Valid for 10 minutes.`
      );
    }

    // Dispatch Email if user has email
    if (user.email && !user.email.endsWith("@phone.planters.com")) {
      sendOTPEmail(user.email, otpCode, "Password Reset").catch((err) =>
        console.error("Reset OTP Email send fail:", err.message)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Reset OTP code sent successfully.",
    });
  } catch (error) {
    console.error("Send Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Verify Reset OTP & Update Password
 * @route POST /api/auth/verify-reset-otp
 * @access Public
 */
export const verifyResetOTP = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Identifier, OTP, and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const clean = identifier.trim().toLowerCase();
    const digits = clean.replace(/\D/g, "");
    const queryConditions = [{ email: clean }];

    if (digits.length >= 7) {
      const phoneVariants = [clean, digits, `+${digits}`];
      if (digits.length >= 10) {
        const last10 = digits.slice(-10);
        phoneVariants.push(last10, `+91${last10}`);
      }
      queryConditions.push({ phone: { $in: phoneVariants } });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    const user = await User.findOne({
      $or: queryConditions,
      "otp.code": hashedOTP,
      "otp.expiresAt": { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    // Update password (pre-save hook hashes it)
    user.password = newPassword;
    user.otp = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully! Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};