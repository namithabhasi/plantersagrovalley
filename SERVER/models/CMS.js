import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: [true, "Page name is required"],
      unique: true,
      enum: [
        "about-us",
        "contact-us",
        "privacy-policy",
        "terms-and-conditions",
        "shipping-policy",
        "return-refund-policy",
        "faq",
      ],
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
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

const CMS = mongoose.model("CMS", cmsSchema);

export default CMS;