import Coupon from "../models/Coupon.js";

/**
 * @desc Create Coupon
 * @route POST /api/coupons
 * @access Private (Admin, Super Admin)
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      usagePerUser,
      validFrom,
      validUntil,
      isActive,
    } = req.body;

    // Check if coupon with this code already exists
    const uppercaseCode = code.trim().toUpperCase();
    const existingCoupon = await Coupon.findOne({
      code: uppercaseCode,
      isDeleted: false,
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: `Coupon with code "${uppercaseCode}" already exists.`,
      });
    }

    const coupon = await Coupon.create({
      code: uppercaseCode,
      name: name.trim(),
      description: description?.trim() || "",
      discountType,
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maximumDiscountAmount: maximumDiscountAmount || 0,
      usageLimit: usageLimit || 0,
      usagePerUser: usagePerUser || 1,
      validFrom,
      validUntil,
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Coupons (Paginated, Filterable)
 * @route GET /api/coupons
 * @access Private (Admin, Super Admin)
 */
export const getCoupons = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, activeOnly, type } = req.query;

    let query = { isDeleted: false };

    // Search filter
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Active status filter
    if (activeOnly === "true") {
      query.isActive = true;
      const now = new Date();
      query.validFrom = { $lte: now };
      query.validUntil = { $gte: now };
    } else if (req.query.isActive) {
      query.isActive = req.query.isActive === "true";
    }

    // Discount Type filter
    if (type && ["percentage", "fixed"].includes(type)) {
      query.discountType = type;
    }

    const totalCoupons = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(totalCoupons / limit),
      totalCoupons,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Coupon Details by ID
 * @route GET /api/coupons/:id
 * @access Private (Admin, Super Admin)
 */
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Coupon Details
 * @route PUT /api/coupons/:id
 * @access Private (Admin, Super Admin)
 */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    const { code } = req.body;

    // Check duplicate code if code is being updated
    if (code) {
      const uppercaseCode = code.trim().toUpperCase();
      if (uppercaseCode !== coupon.code) {
        const duplicateCoupon = await Coupon.findOne({
          code: uppercaseCode,
          isDeleted: false,
          _id: { $ne: coupon._id },
        });

        if (duplicateCoupon) {
          return res.status(400).json({
            success: false,
            message: `Coupon with code "${uppercaseCode}" already exists.`,
          });
        }
        req.body.code = uppercaseCode;
      }
    }

    // Support string boolean conversions if coming from multipart form (optional standard)
    if (req.body.isActive === "true") req.body.isActive = true;
    if (req.body.isActive === "false") req.body.isActive = false;

    Object.assign(coupon, req.body);
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Coupon (Soft Delete)
 * @route DELETE /api/coupons/:id
 * @access Private (Admin, Super Admin)
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isDeleted = true;
    coupon.isActive = false;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
