import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import Subscriber from "../models/Subscriber.js";
import sendEmail from "../utils/sendEmail.js";


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

    // Send email notification to active newsletter subscribers (async, do not await blocking response)
    Subscriber.find({ status: "active" })
      .then((activeSubscribers) => {
        if (activeSubscribers && activeSubscribers.length > 0) {
          const blogUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/blogs?id=${blog._id}`;
          const blogNotificationHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #042817; margin: 0; font-size: 28px; font-weight: 700;">Planters Agro Valley</h1>
                <p style="color: #4a5568; margin-top: 5px; font-size: 14px;">Fresh from the Blog 🌿</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
              
              <div style="color: #2d3748; line-height: 1.6;">
                <h2 style="color: #042817; font-size: 22px; margin-top: 0;">${title}</h2>
                <span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 20px; text-transform: uppercase;">${category.toUpperCase()}</span>
                <span style="color: #718096; font-size: 12px; margin-left: 10px;">${readTime || "5 min read"}</span>
                
                ${imageUrl ? `<div style="margin: 20px 0; text-align: center;"><img src="${imageUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" /></div>` : ""}
                
                <p style="font-size: 15px; color: #4a5568; font-style: italic; margin: 15px 0;">${summary}</p>
                
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${blogUrl}" style="background-color: #042817; color: #ffffff; padding: 12px 24px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">Read the Full Post</a>
                </div>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 35px 0 20px 0;" />
              <div style="text-align: center; font-size: 12px; color: #a0aec0;">
                <p>&copy; 2026 Planters Agro Valley. All rights reserved.</p>
                <p style="margin-top: 5px;">You received this email because you are subscribed to Planters Agro Valley newsletter.</p>
              </div>
            </div>
          `;
          
          const emailPromises = activeSubscribers.map((sub) =>
            sendEmail({
              to: sub.email,
              subject: `New Blog Post: ${title} 🌿`,
              html: blogNotificationHtml,
            })
          );
          
          Promise.allSettled(emailPromises).then((results) => {
            const success = results.filter((r) => r.status === "fulfilled").length;
            const failed = results.filter((r) => r.status === "rejected").length;
            console.log(`Blog alert emails sent: ${success} succeeded, ${failed} failed.`);
          });
        }
      })
      .catch((err) => {
        console.error("Error sending new blog notifications to subscribers:", err);
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
