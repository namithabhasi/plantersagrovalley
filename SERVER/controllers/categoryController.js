import Category from "../models/Category.js";

/**
 * @desc Create Category
 * @route POST /api/categories
 * @access Private (Admin/Super Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parentCategory } = req.body;

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
      image,
      parentCategory: parentCategory || null,
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
    const categories = await Category.find({
      isDeleted: false,
      isActive: true,
    }).populate("parentCategory", "name");

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

    Object.assign(category, req.body);

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