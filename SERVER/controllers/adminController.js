import User from "../models/User.js";

/**
 * @desc    Get all users with pagination, search, and filtering
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "all";
    const status = req.query.status || "all";

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "all") {
      query.role = role;
    }

    if (status !== "all") {
      query.isActive = status === "active";
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new user by Admin
 * @route   POST /api/admin/users
 * @access  Private (Super Admin, Admin)
 */
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      isActive,
    } = req.body;

    // Validate required fields
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name is required.",
      });
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Last name is required.",
      });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be at least 6 characters long.",
      });
    }

    const allowedRoles = ["super-admin", "admin", "shipping-manager", "customer"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected.",
      });
    }

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
      role: role || "customer",
      isActive: isActive !== undefined ? isActive : true,
    });

    // Remove password before sending response
    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user.",
    });
  }
};

/**
 * @desc    Update a user by Admin
 * @route   PUT /api/admin/users/:id
 * @access  Private (Super Admin, Admin)
 */
export const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      isActive,
      password,
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if email is being updated and is already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
      user.email = email.toLowerCase();
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    if (role !== undefined) {
      const allowedRoles = ["super-admin", "admin", "shipping-manager", "customer"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected.",
        });
      }
      user.role = role;
    }

    if (isActive !== undefined) user.isActive = isActive;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }
      user.password = password; // mongoose schema hook will bcrypt hash this
    }

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user.",
    });
  }
};

/**
 * @desc    Delete a user by Admin
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Super Admin, Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Do not allow deleting self
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user.",
    });
  }
};
