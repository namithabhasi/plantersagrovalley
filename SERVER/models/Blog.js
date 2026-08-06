import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
    },
    author: {
      type: String,
      default: "Planters Expert",
      trim: true,
    },
    readTime: {
      type: String,
      default: "5 min read",
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Blog summary is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
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
    date: {
      type: String,
      required: true,
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

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
