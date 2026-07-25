import razorpay from "../config/razorpay.js";

import crypto from "crypto";
import mongoose from "mongoose";


import {
  getCart,
  validateStock,
  validateCoupon,
  calculateOrderAmounts,
  generateOrderNumber,
  createOrder,
  reduceStock,
  updateCouponUsage,
  clearCart,
} from "../services/orderService.js";

/**
 * @desc Create Razorpay Order
 * @route POST /api/payment/create-order
 * @access Private (Customer)
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { couponCode } = req.body;

    // 1. Get Cart
    const cart = await getCart(req.user._id);

    // 2. Validate Stock
    await validateStock(cart);

    // 3. Calculate Subtotal
    let subtotal = 0;

    for (const item of cart.items) {
      const price = item.product.salePrice || item.product.price;
      subtotal += price * item.quantity;
    }

    // 4. Validate Coupon
    const { coupon, discount } = await validateCoupon(
      couponCode,
      subtotal,
      req.user._id
    );

    // 5. Calculate Tax & Shipping
    const {
      tax,
      shipping,
      totalAmount,
    } = await calculateOrderAmounts(subtotal, discount);

    // 6. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    // 7. Return Details
    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully.",

      key: process.env.RAZORPAY_KEY_ID,

      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },

      orderSummary: {
        subtotal,
        discount,
        tax,
        shipping,
        totalAmount,
      },

      coupon: coupon
        ? {
            _id: coupon._id,
            code: coupon.code,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Verify Razorpay Payment
 * @route POST /api/payment/verify
 * @access Private (Customer)
 */
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      couponCode,
      notes,
    } = req.body;

    // Validate Required Fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details.",
      });
    }

    // Verify Signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // Fetch Cart
    const cart = await getCart(req.user._id);

    // Validate Stock Again
    await validateStock(cart);

    // Calculate Subtotal
    let subtotal = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      const price =
        product.salePrice || product.price;

      const itemSubtotal =
        price * item.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image:
          product.images?.[0]?.url || "",
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
      });
    }

    // Validate Coupon Again
    const {
      coupon,
      discount,
    } = await validateCoupon(
      couponCode,
      subtotal,
      req.user._id
    );

    // Calculate Final Amount
    const {
      tax,
      shipping,
      totalAmount,
    } = await calculateOrderAmounts(
      subtotal,
      discount
    );

        // Generate Order Number
    const orderNumber = generateOrderNumber();

    // Create Order
    const order = await createOrder(
      {
        orderNumber,
        user: req.user._id,

        items: orderItems,

        coupon: coupon ? coupon._id : null,

        discountAmount: discount,

        subtotal,

        shippingCharge: shipping,

        tax,

        totalAmount,

        paymentMethod: "Razorpay",

        paymentStatus: "Paid",

        orderStatus: "Pending",

        shippingAddress,

        notes,

        paidAt: new Date(),

        statusHistory: [
          {
            status: "Pending",
            updatedAt: new Date(),
          },
        ],

        paymentDetails: {
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
      session
    );

    // Reduce Product Stock
    await reduceStock(cart, session);

    // Update Coupon Usage
    if (coupon) {
      await updateCouponUsage(
        coupon,
        req.user._id,
        session
      );
    }

    // Clear Cart
    await clearCart(req.user._id, session);

    // Commit Transaction
    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Payment verified successfully.",

      order,
    });

    } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};