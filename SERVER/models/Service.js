import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "corporate-gifting",
        "plant-rental",
        "garden-maintenance",
        "vertical-garden",
        "balcony-garden",
      ],
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
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

const Service = mongoose.model("Service", serviceSchema);

export default Service;
