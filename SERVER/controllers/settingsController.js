import Settings from "../models/Settings.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Get Store Settings
 * @route GET /api/settings
 * @access Private (Admin, Super Admin)
 */
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Seed default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        storeName: "Planters Agro Valley",
        storeEmail: "contact@plantersagrovalley.com",
        storePhone: "9876543210",
        address: {
          line1: "Agro Valley Street",
          city: "Kochi",
          state: "Kerala",
          country: "India",
          postalCode: "682001",
        },
        socialLinks: {
          facebook: "https://facebook.com/plantersagrovalley",
          instagram: "https://instagram.com/plantersagrovalley",
          twitter: "",
          youtube: "",
          linkedin: "",
          pinterest: "",
        },
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Store Settings
 * @route PUT /api/settings
 * @access Private (Super Admin Only)
 */
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    let logoData = settings?.storeLogo || { url: "", public_id: "" };

    // Handle logo upload
    if (req.file) {
      if (logoData.public_id) {
        try {
          await cloudinary.uploader.destroy(logoData.public_id);
        } catch (err) {
          console.error("Failed to delete old logo from Cloudinary", err);
        }
      }
      logoData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updateFields = { ...req.body };
    updateFields.storeLogo = logoData;

    // Parse nested objects if sent as strings via FormData
    const parseJSONField = (fieldName) => {
      if (req.body[fieldName]) {
        try {
          updateFields[fieldName] = typeof req.body[fieldName] === "string" 
            ? JSON.parse(req.body[fieldName]) 
            : req.body[fieldName];
        } catch (e) {
          console.error(`Failed to parse field ${fieldName}`, e);
        }
      }
    };

    parseJSONField("address");
    parseJSONField("socialLinks");


    if (!settings) {
      settings = new Settings(updateFields);
    } else {
      Object.assign(settings, updateFields);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Store settings updated successfully.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
