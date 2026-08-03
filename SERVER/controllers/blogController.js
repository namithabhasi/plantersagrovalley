import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Create Blog
 * @route POST /api/blogs
 * @access Private (Admin/Super Admin)
 */
export const createBlog = async (req, res) => {
  try {
    const { title, category, author, readTime, summary, content } = req.body;
    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    // Format date to: e.g. "AUGUST 03, 2026"
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();

    const blog = await Blog.create({
      title,
      category: category.toUpperCase(),
      author: author || "Planters Expert",
      readTime: readTime || "5 min read",
      summary,
      content,
      image: imageUrl,
      imagePublicId,
      date: formattedDate,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Blogs
 * @route GET /api/blogs
 * @access Public
 */
export const getBlogs = async (req, res) => {
  try {
    const query = { isDeleted: false };
    
    if (req.query.activeOnly === "true") {
      query.isActive = true;
    }

    // Sort by creation time descending, so newest dynamic blogs appear first among database records
    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Single Blog by ID
 * @route GET /api/blogs/:id
 * @access Public
 */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Blog
 * @route PUT /api/blogs/:id
 * @access Private (Admin/Super Admin)
 */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const updateData = { ...req.body };

    // Handle new uploaded image
    if (req.file) {
      // Delete old image from cloudinary if it exists
      if (blog.imagePublicId) {
        await cloudinary.v2.uploader.destroy(blog.imagePublicId).catch((err) => {
          console.error("Failed to delete old blog image from Cloudinary:", err);
        });
      }
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    // Handle boolean conversions from FormData
    if (updateData.isActive === "true") updateData.isActive = true;
    if (updateData.isActive === "false") updateData.isActive = false;
    
    if (updateData.category) {
      updateData.category = updateData.category.toUpperCase();
    }

    Object.assign(blog, updateData);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Blog (Soft Delete)
 * @route DELETE /api/blogs/:id
 * @access Private (Super Admin / Admin)
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    blog.isDeleted = true;
    blog.isActive = false;
    await blog.save();

    // Optionally delete image from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.v2.uploader.destroy(blog.imagePublicId).catch((err) => {
        console.error("Failed to delete blog image from Cloudinary:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
