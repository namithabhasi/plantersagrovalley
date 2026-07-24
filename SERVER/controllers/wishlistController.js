import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/**
 * @desc Add Product to Wishlist
 * @route POST /api/wishlist
 * @access Private (Customer)
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isDeleted || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (item) => item.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist.",
      });
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    await wishlist.populate({
      path: "products",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist.",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Wishlist
 * @route GET /api/wishlist
 * @access Private (Customer)
 */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "products",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: {
          products: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Remove Product from Wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private (Customer)
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found.",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== req.params.productId
    );

    await wishlist.save();

    await wishlist.populate({
      path: "products",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Clear Wishlist
 * @route DELETE /api/wishlist
 * @access Private (Customer)
 */
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found.",
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};