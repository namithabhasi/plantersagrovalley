import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";

/**
 * Helper: Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `PLA-${timestamp}-${random}`;
};

/**
 * Helper: Validate Coupon
 * Reusable for checkout validation and standalone validation API
 */
const validateCouponHelper = async (couponCode, subtotal, cartItems, userId) => {
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isDeleted: false,
  });

  if (!coupon) {
    return { success: false, message: "Coupon not found." };
  }

  if (!coupon.isActive) {
    return { success: false, message: "Coupon is inactive." };
  }

  const now = new Date();
  if (now < coupon.validFrom) {
    return { success: false, message: "Coupon is not active yet." };
  }
  if (now > coupon.validUntil) {
    return { success: false, message: "Coupon has expired." };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, message: "Coupon usage limit has been reached." };
  }

  // Verify usage per user
  const userCouponOrdersCount = await Order.countDocuments({
    user: userId,
    coupon: coupon._id,
    orderStatus: { $ne: "Cancelled" },
    isDeleted: false,
  });

  if (userCouponOrdersCount >= coupon.usagePerUser) {
    return {
      success: false,
      message: `You have reached the maximum usage limit of ${coupon.usagePerUser} for this coupon.`,
    };
  }

  // Calculate eligible subtotal based on product/category restrictions
  let eligibleSubtotal = 0;
  const hasProductRestrictions = coupon.applicableProducts && coupon.applicableProducts.length > 0;
  const hasCategoryRestrictions = coupon.applicableCategories && coupon.applicableCategories.length > 0;

  if (hasProductRestrictions || hasCategoryRestrictions) {
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      let isEligible = false;
      if (
        hasProductRestrictions &&
        coupon.applicableProducts.map(id => id.toString()).includes(product._id.toString())
      ) {
        isEligible = true;
      }
      if (
        hasCategoryRestrictions &&
        product.category &&
        coupon.applicableCategories.map(id => id.toString()).includes(product.category.toString())
      ) {
        isEligible = true;
      }

      if (isEligible) {
        eligibleSubtotal += item.quantity * (product.salePrice || product.price);
      }
    }

    if (eligibleSubtotal === 0) {
      return {
        success: false,
        message: "This coupon is not applicable to any of the products in your cart.",
      };
    }
  } else {
    eligibleSubtotal = subtotal;
  }

  if (eligibleSubtotal < coupon.minimumOrderAmount) {
    return {
      success: false,
      message: `Minimum order amount of ${coupon.minimumOrderAmount} is required to apply this coupon.`,
    };
  }

  // Calculate discount value
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = eligibleSubtotal * (coupon.discountValue / 100);
    if (coupon.maximumDiscountAmount > 0 && discountAmount > coupon.maximumDiscountAmount) {
      discountAmount = coupon.maximumDiscountAmount;
    }
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed total order subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  return { success: true, discountAmount, coupon };
};

/**
 * @desc Place Order
 * @route POST /api/orders
 * @access Private (Customer)
 */
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, notes, paymentDetails } = req.body;

    // 1. Fetch Cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // 2. Stock and Product Validation
    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.isDeleted || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product matching ID ${item.product} is no longer available.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`,
        });
      }

      const itemPrice = product.salePrice || product.price;
      const itemSubtotal = item.quantity * itemPrice;
      calculatedSubtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0].url : "",
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      });
    }

    // 3. Coupon Validation
    let discountAmount = 0;
    let couponId = null;
    let couponDoc = null;

    if (couponCode) {
      const couponValidation = await validateCouponHelper(
        couponCode,
        calculatedSubtotal,
        cart.items,
        req.user._id
      );

      if (!couponValidation.success) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message,
        });
      }

      discountAmount = couponValidation.discountAmount;
      couponDoc = couponValidation.coupon;
      couponId = couponDoc._id;
    }

    // 4. Calculate Tax and Shipping charges
    const settings = (await Settings.findOne()) || {};
    const taxPercentage = settings.taxPercentage || 0;
    const shippingChargeSetting = settings.shippingCharge || 0;
    const freeShippingMin = settings.freeShippingMinimumOrder || 0;

    const taxableAmount = calculatedSubtotal - discountAmount;
    const tax = Math.round((taxableAmount * taxPercentage / 100) * 100) / 100;

    const shippingCharge =
      freeShippingMin > 0 && taxableAmount >= freeShippingMin ? 0 : shippingChargeSetting;

    const totalAmount = taxableAmount + tax + shippingCharge;

    // 5. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 6. Update Product Stocks
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 7. Increment Coupon usage if applicable
    if (couponId) {
      await Coupon.findByIdAndUpdate(couponId, {
        $inc: { usedCount: 1 },
      });
    }

    // 8. Create and Save Order
    const order = new Order({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      coupon: couponId,
      discountAmount,
      subtotal: calculatedSubtotal,
      shippingCharge,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid", // Set initial payment status
      orderStatus: "Pending",
      shippingAddress,
      statusHistory: [{ status: "Pending", updatedAt: new Date() }],
      notes,
      paymentDetails: paymentDetails || {},
      paidAt: paymentMethod !== "COD" ? new Date() : null,
    });

    await order.save();

    // 9. Clear the user's cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place order. " + error.message,
    });
  }
};

/**
 * @desc Validate Coupon
 * @route POST /api/orders/validate-coupon
 * @access Private (Customer)
 */
export const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Add products to validate coupon.",
      });
    }

    // Calculate subtotal from products in cart
    let subtotal = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        subtotal += item.quantity * (product.salePrice || product.price);
      }
    }

    const validation = await validateCouponHelper(couponCode, subtotal, cart.items, req.user._id);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid.",
      discountAmount: validation.discountAmount,
      coupon: {
        code: validation.coupon.code,
        name: validation.coupon.name,
        discountType: validation.coupon.discountType,
        discountValue: validation.coupon.discountValue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Validate Stock
 * @route GET /api/orders/validate-stock
 * @access Private (Customer)
 */
export const validateStock = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const stockStatus = [];
    let isAllInStock = true;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.isDeleted) {
        stockStatus.push({
          product: item.product,
          name: "Unavailable Product",
          requested: item.quantity,
          available: 0,
          inStock: false,
        });
        isAllInStock = false;
        continue;
      }

      const inStock = product.stock >= item.quantity;
      if (!inStock) {
        isAllInStock = false;
      }

      stockStatus.push({
        product: product._id,
        name: product.name,
        requested: item.quantity,
        available: product.stock,
        inStock,
      });
    }

    res.status(200).json({
      success: true,
      isAllInStock,
      stockStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Logged-in User's Orders
 * @route GET /api/orders/my-orders
 * @access Private (Customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      user: req.user._id,
      isDeleted: false,
    };

    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("items.product", "name images price salePrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Order Details By ID
 * @route GET /api/orders/:id
 * @access Private (Customer/Admin/Shipping Manager)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("coupon", "code name discountType discountValue");

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Authorization: User owns the order, or is Admin/Super Admin/Shipping Manager
    const isAdmin = ["super-admin", "admin", "shipping-manager"].includes(req.user.role);
    const isOwner = order.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Cancel Order
 * @route PUT /api/orders/:id/cancel
 * @access Private (Customer/Admin)
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Role check and Ownership
    const isAdmin = ["super-admin", "admin"].includes(req.user.role);
    const isOwner = order.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    // Cancel constraints
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled.",
      });
    }

    // Customers can only cancel when order is Pending, Confirmed, or Processing
    if (!isAdmin && !["Pending", "Confirmed", "Processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order status is "${order.orderStatus}". Shipped or delivered orders cannot be cancelled by customer.`,
      });
    }

    // Restore Inventory stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Restore Coupon usage count if applicable
    if (order.coupon) {
      await Coupon.findByIdAndUpdate(order.coupon, {
        $inc: { usedCount: -1 },
      });
    }

    // Update order status
    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: "Cancelled",
      updatedAt: new Date(),
    });

    // Mark as refunded if paid
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Orders
 * @route GET /api/orders
 * @access Private (Admin/Shipping Manager)
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: "i" } },
        { "shippingAddress.receiverName": { $regex: req.query.search, $options: "i" } },
      ];
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Order Status & Details
 * @route PUT /api/orders/:id/status
 * @access Private (Admin/Shipping Manager)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const oldStatus = order.orderStatus;

    // Handle status transitions
    if (orderStatus && orderStatus !== oldStatus) {
      if (oldStatus === "Cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cannot transition out of a Cancelled state.",
        });
      }

      if (oldStatus === "Delivered") {
        return res.status(400).json({
          success: false,
          message: "Cannot transition out of a Delivered state.",
        });
      }

      // If transition to Cancelled
      if (orderStatus === "Cancelled") {
        // Restore stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        // Release coupon
        if (order.coupon) {
          await Coupon.findByIdAndUpdate(order.coupon, {
            $inc: { usedCount: -1 },
          });
        }
        order.cancelledAt = new Date();
        if (order.paymentStatus === "Paid") {
          order.paymentStatus = "Refunded";
        }
      }

      // If transition to Delivered
      if (orderStatus === "Delivered") {
        order.deliveredAt = new Date();
        order.paymentStatus = "Paid"; // Delievered implies paid (especially COD)
        order.paidAt = order.paidAt || new Date();
      }

      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        updatedAt: new Date(),
      });
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid") {
        order.paidAt = new Date();
      }
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery !== undefined) {
      order.estimatedDelivery = estimatedDelivery;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Order (Soft Delete)
 * @route DELETE /api/orders/:id
 * @access Private (Admin Only)
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.isDeleted = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order soft deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
