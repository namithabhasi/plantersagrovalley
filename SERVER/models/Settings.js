import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },

   storeLogo: {
  url: {
    type: String,
    default: "",
  },
  public_id: {
    type: String,
    default: "",
  },
},

    storeEmail: {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  match: [
    /^\S+@\S+\.\S+$/,
    "Please enter a valid email address",
  ],
},

    storePhone: {
      type: String,
      required: true,
      trim: true,
      match: [
  /^[0-9]{10,15}$/,
  "Please enter a valid phone number",
],
    },

   address: {
  line1: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
},
    currencySymbol: {
      type: String,
      default: "₹",
    },

    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    freeShippingMinimumOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      isDefault: {
  type: Boolean,
  default: true,
  unique: true,
},
    },
    paymentGateway: {
  razorpayKeyId: {
    type: String,
    default: "",
  },

  razorpayEnabled: {
    type: Boolean,
    default: true,
  },

  codEnabled: {
    type: Boolean,
    default: true,
  },
},
seo: {
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
},
productsPerPage: {
  type: Number,
  default: 12,
},
orderSettings: {
  allowCancellation: {
    type: Boolean,
    default: true,
  },

  cancellationHours: {
    type: Number,
    default: 24,
  },
},
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
