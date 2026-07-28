import User from "../models/User.js";
import Notification from "../models/Notification.js";

/**
 * Creates and saves a notification for all admin users (super-admin, admin, shipping-manager)
 */
export const createAdminNotification = async ({ title, message, type, orderId, productId }) => {
  try {
    const admins = await User.find({
      role: { $in: ["super-admin", "admin", "shipping-manager"] },
      isActive: true,
    });

    const notificationsToInsert = admins.map((admin) => ({
      recipient: admin._id,
      title,
      message,
      type,
      order: orderId || null,
      product: productId || null,
      isRead: false,
    }));

    if (notificationsToInsert.length > 0) {
      await Notification.insertMany(notificationsToInsert);
    }
  } catch (error) {
    console.error("Failed to create admin notification:", error);
  }
};
