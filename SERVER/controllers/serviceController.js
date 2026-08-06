import Service from "../models/Service.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Create Service
 * @route POST /api/services
 * @access Private (Admin/Super Admin)
 */
export const createService = async (req, res) => {
  try {
    const { serviceType, title, description } = req.body;
    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const service = await Service.create({
      serviceType: serviceType.toLowerCase().trim(),
      title,
      description,
      image: imageUrl,
      imagePublicId,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Services
 * @route GET /api/services
 * @access Public
 */
export const getServices = async (req, res) => {
  try {
    const query = { isDeleted: false };
    
    if (req.query.activeOnly === "true") {
      query.isActive = true;
    }

    if (req.query.serviceType) {
      query.serviceType = req.query.serviceType.toLowerCase().trim();
    }

    // Sort by newest first
    const services = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Single Service by ID
 * @route GET /api/services/:id
 * @access Public
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Service
 * @route PUT /api/services/:id
 * @access Private (Admin/Super Admin)
 */
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const updateData = { ...req.body };

    // Handle new uploaded image
    if (req.file) {
      // Delete old image from cloudinary if it exists
      if (service.imagePublicId) {
        await cloudinary.uploader.destroy(service.imagePublicId).catch((err) => {
          console.error("Failed to delete old service image from Cloudinary:", err);
        });
      }
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    // Handle boolean conversions from FormData
    if (updateData.isActive === "true") updateData.isActive = true;
    if (updateData.isActive === "false") updateData.isActive = false;

    if (updateData.serviceType) {
      updateData.serviceType = updateData.serviceType.toLowerCase().trim();
    }

    Object.assign(service, updateData);
    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Service (Soft Delete)
 * @route DELETE /api/services/:id
 * @access Private (Admin/Super Admin)
 */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    service.isDeleted = true;
    service.isActive = false;
    await service.save();

    // Optionally delete image from Cloudinary
    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId).catch((err) => {
        console.error("Failed to delete service image from Cloudinary:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
