import Category from "../models/Category.js";

/**
 * @desc Create Category
 * @route POST /api/categories
 * @access Private (Admin/Super Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parentCategory } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const exists = await Category.findOne({
      $or: [{ name }, { slug }],
      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageUrl,
      parentCategory: (parentCategory === "none" || parentCategory === "" || parentCategory === "null") ? null : parentCategory,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Categories
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = async (req, res) => {
  try {
    const query = { isDeleted: false };

    // Only filter by active status if activeOnly query param is true
    if (req.query.activeOnly === "true") {
      query.isActive = true;
    }

    const categories = await Category.find(query).populate("parentCategory", "name");

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Category By ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("parentCategory", "name");

    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Category
 * @route PUT /api/categories/:id
 * @access Private (Admin/Super Admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const updateData = { ...req.body };

    // Handle uploaded file if present
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Handle parentCategory defaults
    if (updateData.parentCategory === "none" || updateData.parentCategory === "" || updateData.parentCategory === "null") {
      updateData.parentCategory = null;
    }

    // Handle boolean values sent as strings via FormData
    if (updateData.isActive === "true") updateData.isActive = true;
    if (updateData.isActive === "false") updateData.isActive = false;

    Object.assign(category, updateData);

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Category (Soft Delete)
 * @route DELETE /api/categories/:id
 * @access Private (Super Admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    category.isDeleted = true;
    category.isActive = false;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};