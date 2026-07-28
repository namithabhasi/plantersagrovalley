import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Create Banner
 * @route POST /api/banners
 * @access Private (Admin, Super Admin)
 */
export const createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      displayOrder,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required.",
      });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      displayOrder,
      startDate,
      endDate,
      isActive,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully.",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Active Banners
 * @route GET /api/banners
 * @access Public
 */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      isDeleted: false,
      isActive: true,
    }).sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Banner By ID
 * @route GET /api/banners/:id
 * @access Public
 */
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner || banner.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Banner
 * @route PUT /api/banners/:id
 * @access Private (Admin, Super Admin)
 */
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner || banner.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    // Delete old image if a new one is uploaded
    if (req.file) {
      if (banner.image?.public_id) {
        await cloudinary.uploader.destroy(banner.image.public_id);
      }

      banner.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    Object.assign(banner, req.body);

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully.",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Banner (Soft Delete)
 * @route DELETE /api/banners/:id
 * @access Private (Super Admin)
 */
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner || banner.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    // Delete image from Cloudinary
    if (banner.image?.public_id) {
      await cloudinary.uploader.destroy(banner.image.public_id);
    }

    banner.isDeleted = true;
    banner.isActive = false;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};