import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeLogo: {
      type: String,
      default: "",
    },

    storeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    storePhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
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
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
