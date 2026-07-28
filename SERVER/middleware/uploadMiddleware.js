import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Product Images
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "planters/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

// Category Images
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "planters/categories",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

// Banner Images
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "planters/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 1920,
        height: 800,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

// User Profile Images
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "planters/users",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
  }
};

export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export const uploadBannerImage = multer({
  storage: bannerStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadUserImage = multer({
  storage: userStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadSettingsLogo = multer({
  storage: categoryStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
