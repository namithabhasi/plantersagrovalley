import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

/**
 * @desc    Get all notifications for authenticated user
 * @route   GET /api/admin/notifications
 * @access  Private (Admin, Super Admin)
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Scan for real low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isDeleted: false });
    for (const prod of lowStockProducts) {
      const existingNotif = await Notification.findOne({
        recipient: userId,
        type: "inventory",
        product: prod._id,
      });

      if (!existingNotif) {
        await Notification.create({
          recipient: userId,
          title: "Inventory Alert: Low Stock",
          message: `Product "${prod.name}" is low in stock (${prod.stock} items left).`,
          type: "inventory",
          product: prod._id,
          isRead: false,
        });
      }
    }

    // 2. Scan for recent orders
    const recentOrders = await Order.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName");

    for (const ord of recentOrders) {
      const existingNotif = await Notification.findOne({
        recipient: userId,
        type: "order",
        order: ord._id,
      });

      if (!existingNotif) {
        const customerName = ord.user ? `${ord.user.firstName} ${ord.user.lastName}` : "Customer";
        await Notification.create({
          recipient: userId,
          title: "New Order Placed",
          message: `Order #${ord.orderNumber} has been placed by user ${customerName} (Total: $${ord.totalAmount.toFixed(2)})`,
          type: "order",
          order: ord._id,
          isRead: false,
          createdAt: ord.createdAt,
        });
      }
    }

    // 3. Scan for recent reviews
    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName")
      .populate("product", "name");

    for (const rev of recentReviews) {
      if (!rev.product) continue;
      
      const reviewerName = rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : "Customer";
      const messageCheck = `by user ${reviewerName}`;
      
      const existingNotif = await Notification.findOne({
        recipient: userId,
        type: "review",
        product: rev.product._id,
        message: { $regex: messageCheck, $options: "i" },
      });

      if (!existingNotif) {
        await Notification.create({
          recipient: userId,
          title: "New Product Review",
          message: `A new ${rev.rating}-star review has been posted on "${rev.product.name}" by user ${reviewerName}.`,
          type: "review",
          product: rev.product._id,
          isRead: false,
          createdAt: rev.createdAt,
        });
      }
    }

    // Now retrieve all active notifications
    const notifications = await Notification.find({ recipient: userId, isDeleted: false })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/admin/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Error in markAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/admin/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false, isDeleted: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
    });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/admin/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};
