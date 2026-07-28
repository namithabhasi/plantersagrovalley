import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
/**
 * @desc Create Product
 * @route POST /api/products
 * @access Private (Admin, Super Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
  name,
  slug,
  sku,
  description,
  shortDescription,
  category,
  price,
  salePrice,
  stock,
  brand,
  tags,
  isFeatured,
} = req.body;
const images = req.files
  ? req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }))
  : [];

    // Check if category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists || categoryExists.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check duplicate SKU or slug
    const existingProduct = await Product.findOne({
      $or: [{ sku }, { slug }],
      isDeleted: false,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU or slug already exists.",
      });
    }

    const product = await Product.create({
      name,
      slug,
      sku,
      description,
      shortDescription,
      category,
      price,
      salePrice,
      stock,
      images,
      brand,
      tags,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const {
  keyword,
  category,
  minPrice,
  maxPrice,
  sort,
  featured,
  inStock,
} = req.query;

    let filter = {
      isDeleted: false,
    };

    if (req.query.activeOnly === "true") {
      filter.isActive = true;
    }

    // Search
    if (keyword) {
  filter.$or = [
    {
      name: {
        $regex: keyword,
        $options: "i",
      },
    },
    {
      brand: {
        $regex: keyword,
        $options: "i",
      },
    },
    {
      tags: {
        $regex: keyword,
        $options: "i",
      },
    },
  ];
}

    // Category
    if (category) {
      filter.category = category;
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    // Featured Products
if (featured === "true") {
  filter.isFeatured = true;
}

// Stock Filter
if (inStock === "true") {
  filter.stock = {
    $gt: 0,
  };
}

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
  case "latest":
    sortOption = { createdAt: -1 };
    break;

  case "oldest":
    sortOption = { createdAt: 1 };
    break;

  case "price-asc":
    sortOption = { price: 1 };
    break;

  case "price-desc":
    sortOption = { price: -1 };
    break;

  case "name-asc":
    sortOption = { name: 1 };
    break;

  case "name-desc":
    sortOption = { name: -1 };
    break;

  default:
    sortOption = { createdAt: -1 };
}

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Get Product By ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name");

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Update Product
 * @route PUT /api/products/:id
 * @access Private (Admin, Super Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }

      // Save new images
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }
    // Validate category if it is being changed
if (req.body.category) {
  const categoryExists = await Category.findById(req.body.category);

  if (!categoryExists || categoryExists.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }
}
const duplicateProduct = await Product.findOne({
  _id: { $ne: product._id },
  isDeleted: false,
  $or: [
    { sku: req.body.sku },
    { slug: req.body.slug },
  ],
});

if (duplicateProduct) {
  return res.status(400).json({
    success: false,
    message: "Product with this SKU or slug already exists.",
  });
}
    // Update other fields
    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Product
 * @route DELETE /api/products/:id
 * @access Private (Super Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

   // Since this is a soft delete, keep the images in Cloudinary.
// They can be reused if the product is restored later.
    // Soft delete product
    product.isDeleted = true;
    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Featured Products
 * @route GET /api/products/featured
 * @access Public
 */
export const getFeaturedProducts = async (req, res) => {

  try {

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      isDeleted: false,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isDeleted: false,
      isActive: true,
    }).limit(4);

    res.status(200).json({
      success: true,
      products: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};