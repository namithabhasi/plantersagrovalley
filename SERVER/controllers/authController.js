import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendWelcomeEmail, sendProfileUpdateEmail } from "../utils/orderEmailHelper.js";

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
   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

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

console.log("User:", user);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "User not found",
  });
}

const isMatch = await user.comparePassword(password);

console.log("Password Match:", isMatch);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Password incorrect",
  });
}
    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Save cookie
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

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
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

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
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
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