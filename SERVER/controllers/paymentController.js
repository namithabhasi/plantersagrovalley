import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import generateToken from "../utils/generateToken.js";
import { sendOrderTrackingEmail } from "../utils/orderEmailHelper.js";
import Subscriber from "../models/Subscriber.js";
import Coupon from "../models/Coupon.js";
import sendEmail from "../utils/sendEmail.js";

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

// Standalone mock ID to MongoId helper
const getMongoIdFromMockId = (mockId) => {
  if (!mockId) return mockId;
  // If it's already a valid 24-character hex ObjectId, return it as-is
  if (typeof mockId === "string" && /^[0-9a-fA-F]{24}$/.test(mockId)) {
    return mockId;
  }
  let hex = "";
  for (let i = 0; i < mockId.length; i++) {
    hex += mockId.charCodeAt(i).toString(16);
  }
  return hex.padEnd(24, "0").slice(0, 24);
};

/**
 * @desc Create Razorpay Order
 * @route POST /api/payment/create-order
 * @access Public
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { couponCode, cartItems } = req.body;

    let cart;
    if (req.user) {
      // 1. Get Cart from DB for registered customers
      cart = await getCart(req.user._id);
    } else {
      // 1. Build virtual cart for guest checkout
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty. Please add items to checkout.",
        });
      }

      const items = [];
      for (const item of cartItems) {
        const prodId = getMongoIdFromMockId(item.id || item.product);
        const product = await Product.findById(prodId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product "${item.name || prodId}" not found.`,
          });
        }
        items.push({
          product,
          quantity: Number(item.quantity),
        });
      }
      cart = { items };
    }

    // 2. Validate Stock
    await validateStock(cart);

    // 3. Calculate Subtotal
    let subtotal = 0;

    for (const item of cart.items) {
      const price = item.product.salePrice || item.product.price;
      subtotal += price * item.quantity;
    }

    // 4. Validate Coupon (only if user is registered, or using guest userId as null)
    const userId = req.user ? req.user._id : new mongoose.Types.ObjectId();
    const { coupon, discount } = await validateCoupon(
      couponCode,
      subtotal,
      userId
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
    console.error("Payment initiation error:", error);
    const errMsg = error.error?.description || error.message || "Failed to initiate payment.";
    return res.status(500).json({
      success: false,
      message: errMsg,
    });
  }
};

/**
 * @desc Verify Razorpay Payment
 * @route POST /api/payment/verify
 * @access Public
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
      email,
      phone,
      firstName,
      lastName,
      cartItems,
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

    // Resolve or Create User
    let orderUser = req.user;
    if (!orderUser) {
      if (!email || !phone || !firstName || !lastName) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Guest details are required for guest checkout.",
        });
      }

      orderUser = await User.findOne({ email: email.toLowerCase() });
      if (!orderUser) {
        const randomPassword = crypto.randomBytes(8).toString("hex");
        const [newGuest] = await User.create(
          [
            {
              firstName,
              lastName,
              email: email.toLowerCase(),
              phone,
              password: randomPassword,
              role: "customer",
              isVerified: false,
            },
          ],
          { session }
        );
        orderUser = newGuest;
      }
    }

    // Fetch or Build Cart
    let cart;
    if (req.user) {
      cart = await getCart(req.user._id);
    } else {
      if (!cartItems || cartItems.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Cart items are required for guest checkout verification.",
        });
      }

      const items = [];
      for (const item of cartItems) {
        const prodId = getMongoIdFromMockId(item.id || item.product);
        const product = await Product.findById(prodId);
        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({
            success: false,
            message: `Product "${item.name || prodId}" not found.`,
          });
        }
        items.push({
          product,
          quantity: Number(item.quantity),
        });
      }
      cart = { items };
    }

    // Validate Stock Again
    await validateStock(cart);

    // Calculate Subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      const price = product.salePrice || product.price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "",
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
      orderUser._id
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
        user: orderUser._id,
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
        orderUser._id,
        session
      );
    }

    // Clear Cart (only if registered user)
    if (req.user) {
      await clearCart(req.user._id, session);
    }

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // Automatically send the order tracking ID to customer as mail
    sendOrderTrackingEmail(order, orderUser);

    // Automatically subscribe to newsletter if checked during checkout
    if (req.body.emailMarketing) {
      const emailToSub = orderUser.email.toLowerCase().trim();
      Subscriber.findOne({ email: emailToSub })
        .then(async (subscriber) => {
          let isNewSub = false;
          if (subscriber) {
            if (subscriber.status !== "active") {
              subscriber.status = "active";
              await subscriber.save();
              isNewSub = true;
            }
          } else {
            await Subscriber.create({ email: emailToSub });
            isNewSub = true;
          }

          if (isNewSub) {
            let welcomeCoupon = await Coupon.findOne({ code: "WELCOME10", isDeleted: false });
            if (!welcomeCoupon) {
              welcomeCoupon = await Coupon.create({
                code: "WELCOME10",
                name: "Welcome Discount",
                description: "10% off for subscribing to our newsletter",
                discountType: "percentage",
                discountValue: 10,
                usageLimit: 0,
                usagePerUser: 1,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000),
                isActive: true,
              });
              console.log("WELCOME10 coupon created successfully during order check.");
            }

            const welcomeHtml = `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #042817; margin: 0; font-size: 28px; font-weight: 700;">Planters Agro Valley</h1>
                  <p style="color: #4a5568; margin-top: 5px; font-size: 14px;">Welcome to Our Green Community 🌿</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
                <div style="color: #2d3748; line-height: 1.6;">
                  <p style="font-size: 16px; font-weight: 600;">Hello there,</p>
                  <p>Thank you for subscribing to our newsletter! We are thrilled to have you with us. From now on, you'll be the first to hear about our new plant arrivals, gardening events, tips, and exclusive subscriber-only deals.</p>
                  
                  <div style="background-color: #f7fafc; border: 1px dashed #48bb78; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                    <p style="margin: 0; font-size: 14px; color: #4a5568; text-transform: uppercase; tracking-wider: 1px;">Your Welcome Gift</p>
                    <h2 style="margin: 10px 0; color: #042817; font-size: 32px; font-weight: 800;">10% OFF</h2>
                    <p style="margin: 5px 0 15px 0; font-size: 14px; color: #718096;">Use the code below at checkout on your first order:</p>
                    <span style="background-color: #042817; color: #ffffff; padding: 10px 20px; font-size: 18px; font-weight: bold; border-radius: 6px; letter-spacing: 2px; display: inline-block;">WELCOME10</span>
                  </div>
                  
                  <p>Happy Gardening!</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 35px 0 20px 0;" />
                <div style="text-align: center; font-size: 12px; color: #a0aec0;">
                  <p>&copy; 2026 Planters Agro Valley. All rights reserved.</p>
                </div>
              </div>
            `;

            sendEmail({
              to: emailToSub,
              subject: "Welcome to Planters Agro Valley! 🌿 Here is your welcome gift",
              html: welcomeHtml,
            }).catch(e => console.error("Auto order welcome email failed:", e));
          }
        })
        .catch((err) => console.error("Error subscribing user during checkout verification:", err));
    }

    // If guest user, set cookie to log them in automatically
    if (!req.user) {
      const token = generateToken(orderUser._id, orderUser.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Return success
    const responsePayload = {
      success: true,
      message: "Payment verified and order created successfully.",
      order,
    };

    if (!req.user) {
      const orderUserObj = orderUser.toObject();
      delete orderUserObj.password;
      responsePayload.user = orderUserObj;
    }

    return res.status(201).json(responsePayload);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};