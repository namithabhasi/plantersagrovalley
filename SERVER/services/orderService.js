import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";
import Order from "../models/Order.js";

/**
 * Generate Order Number
 */
export const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Get Cart
 */
export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  return cart;
};

/**
 * Validate Stock
 */
export const validateStock = async (cart) => {
  for (const item of cart.items) {
   if (!item.product || item.product.isDeleted || !item.product.isActive) {
  throw new Error(`${item.product?.name || "Product"} is unavailable.`);
}

    if (item.product.stock < item.quantity) {
      throw new Error(
        `${item.product.name} has only ${item.product.stock} item(s) left in stock.`
      );
    }
  }
};

/**
 * Calculate Tax & Shipping
 */
export const calculateOrderAmounts = async (
  subtotal,
  discount = 0
) => {
  const settings = await Settings.findOne();

  const taxPercentage = settings?.taxPercentage || 0;
  const shippingCharge = settings?.shippingCharge || 0;
  const freeShippingMin =
    settings?.freeShippingMinimumOrder || 0;

  const taxableAmount = subtotal - discount;

  const tax = Number(
    ((taxableAmount * taxPercentage) / 100).toFixed(2)
  );

  const shipping =
    taxableAmount >= freeShippingMin
      ? 0
      : shippingCharge;

  const totalAmount = taxableAmount + tax + shipping;

  return {
    tax,
    shipping,
    totalAmount,
  };
};



/**
 * Reduce Product Stock
 */
export const reduceStock = async (cart, session) => {
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      },
      { session }
    );
  }
};

/**
 * Restore Stock
 */
export const restoreStock = async (order) => {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          stock: item.quantity,
          sold: -item.quantity,
        },
      }
    );
  }
};

/**
 * Clear Cart
 */
export const clearCart = async (userId, session) => {
  await Cart.findOneAndUpdate(
    { user: userId },
    {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    },
    { session }
  );
};

/**
 * Update Coupon Usage
 */
export const updateCouponUsage = async (
  coupon,
  userId
) => {
  if (!coupon) return;

  coupon.usedCount += 1;

  const existing = coupon.usedBy.find(
    (u) => u.user.toString() === userId.toString()
  );

  if (existing) {
    existing.count += 1;
  } else {
    coupon.usedBy.push({
      user: userId,
      count: 1,
    });
  }

  await coupon.save();
};

/**
 * Create Order
 */
export const createOrder = async (orderData, session) => {
  const [order] = await Order.create([orderData], { session });
  return order;
};

/**
 * Validate Coupon
 */
export const validateCoupon = async (
  couponCode,
  subtotal,
  userId
) => {
  if (!couponCode) {
    return {
      coupon: null,
      discount: 0,
    };
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new Error("Invalid coupon.");
  }

  const now = new Date();

  if (
    coupon.validFrom &&
    coupon.validFrom > now
  ) {
    throw new Error("Coupon is not active yet.");
  }

  if (
    coupon.validUntil &&
    coupon.validUntil < now
  ) {
    throw new Error("Coupon has expired.");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit exceeded.");
  }

  if (subtotal < coupon.minimumOrderAmount) {
    throw new Error(
      `Minimum order amount is ₹${coupon.minimumOrderAmount}.`
    );
  }

  const userUsage = coupon.usedBy.find(
    (item) => item.user.toString() === userId.toString()
  );

  if (
    userUsage &&
    userUsage.count >= coupon.usagePerUser
  ) {
    throw new Error("Coupon usage limit exceeded for this user.");
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (subtotal * coupon.discountValue) / 100;

    if (
      coupon.maximumDiscountAmount &&
      discount > coupon.maximumDiscountAmount
    ) {
      discount = coupon.maximumDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return {
    coupon,
    discount,
  };
};