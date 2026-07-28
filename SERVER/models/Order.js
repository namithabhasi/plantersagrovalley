import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "Razorpay",
        "Stripe",
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    shippingAddress: {
      receiverName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      addressLine1: {
        type: String,
        required: true,
      },

      addressLine2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },
    },

    paidAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
    
    trackingNumber: {
  type: String,
  default: "",
},
estimatedDelivery: {
  type: Date,
  default: null,
},
paymentDetails: {
  type: new mongoose.Schema(
    {
      transactionId: {
        type: String,
        default: "",
      },
      razorpayOrderId: {
        type: String,
        default: "",
      },
      razorpayPaymentId: {
        type: String,
        default: "",
      },
      razorpaySignature: {
        type: String,
        default: "",
      },
    },
    { _id: false }
  ),
  default: {},
},
statusHistory: [
  {
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    cancelledAt: {
  type: Date,
  default: null,
},

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "shippingAddress.phone": 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;