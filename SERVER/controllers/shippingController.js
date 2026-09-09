import Order from "../models/Order.js";
import { logAudit } from "../utils/auditLogger.js";

/**
 * @desc    Get orders for Shipping & Logistics Management
 * @route   GET /api/shipping/orders
 * @access  Private (Shipping Manager, Super Admin, Admin)
 */
export const getShippingOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const search = req.query.search || "";
    const status = req.query.status || "all";
    const courier = req.query.courier || "all";

    const andConditions = [{ isDeleted: false }];

    if (search) {
      andConditions.push({
        $or: [
          { orderNumber: { $regex: search, $options: "i" } },
          { awbTrackingNumber: { $regex: search, $options: "i" } },
          { trackingNumber: { $regex: search, $options: "i" } },
          { "shippingAddress.receiverName": { $regex: search, $options: "i" } },
          { "shippingAddress.phone": { $regex: search, $options: "i" } },
        ],
      });
    }

    if (status !== "all") {
      if (status === "Pending Dispatch") {
        andConditions.push({
          $or: [
            { transitStatus: "Pending Dispatch" },
            { transitStatus: { $exists: false } },
          ],
          orderStatus: { $nin: ["Delivered", "Cancelled", "Return Requested", "Return Approved", "Returned"] },
        });
      } else if (status === "In Transit") {
        andConditions.push({
          $or: [
            { transitStatus: "In Transit" },
            { transitStatus: "Out for Delivery" },
            { orderStatus: "Shipped" },
          ],
        });
      } else if (status === "Delivered") {
        andConditions.push({
          $or: [
            { transitStatus: "Delivered" },
            { orderStatus: "Delivered" },
          ],
        });
      } else if (status === "RTO Initiated") {
        andConditions.push({
          $or: [
            { transitStatus: "RTO Initiated" },
            { orderStatus: "Return Requested" },
          ],
        });
      } else if (status === "RTO In Transit") {
        andConditions.push({
          $or: [
            { transitStatus: "RTO In Transit" },
            { orderStatus: "Return Approved" },
          ],
        });
      } else if (status === "RTO Delivered") {
        andConditions.push({
          $or: [
            { transitStatus: "RTO Delivered" },
            { orderStatus: "Returned" },
          ],
        });
      } else if (status.includes("RTO") || status.includes("Return")) {
        andConditions.push({
          $or: [
            { transitStatus: { $regex: "RTO", $options: "i" } },
            { orderStatus: { $in: ["Return Requested", "Returned", "Return Approved"] } },
          ],
        });
      } else {
        andConditions.push({
          $or: [
            { orderStatus: { $regex: status, $options: "i" } },
            { transitStatus: { $regex: status, $options: "i" } },
          ],
        });
      }
    }

    if (courier !== "all") {
      andConditions.push({ courierPartner: { $regex: courier, $options: "i" } });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    const stats = {
      pendingCount: await Order.countDocuments({
        isDeleted: false,
        orderStatus: { $nin: ["Delivered", "Cancelled", "Return Requested", "Return Approved", "Returned"] },
        $or: [{ transitStatus: "Pending Dispatch" }, { transitStatus: { $exists: false } }],
      }),
      inTransitCount: await Order.countDocuments({
        isDeleted: false,
        $or: [{ transitStatus: "In Transit" }, { transitStatus: "Out for Delivery" }, { orderStatus: "Shipped" }],
      }),
      deliveredCount: await Order.countDocuments({
        isDeleted: false,
        $or: [{ transitStatus: "Delivered" }, { orderStatus: "Delivered" }],
      }),
      rtoCount: await Order.countDocuments({
        isDeleted: false,
        $or: [
          { transitStatus: { $regex: "RTO", $options: "i" } },
          { orderStatus: { $in: ["Return Requested", "Returned", "Return Approved"] } },
        ],
      }),
    };

    return res.status(200).json({
      success: true,
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats,
    });
  } catch (error) {
    console.error("Get Shipping Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipping orders.",
      error: error.message,
    });
  }
};

/**
 * @desc    Dispatch order with AWB and Courier Partner details
 * @route   POST /api/shipping/orders/:id/dispatch
 * @access  Private (Shipping Manager, Super Admin, Admin)
 */
export const dispatchOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierPartner, awbTrackingNumber, shippingNotes } = req.body;

    if (!courierPartner || !awbTrackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Courier partner and AWB tracking number are required for dispatch.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.courierPartner = courierPartner.trim();
    order.awbTrackingNumber = awbTrackingNumber.trim();
    order.trackingNumber = awbTrackingNumber.trim();
    order.dispatchedAt = new Date();
    order.orderStatus = "Shipped";
    order.transitStatus = "In Transit";

    if (shippingNotes) {
      order.shippingNotes = shippingNotes;
    }

    order.statusHistory.push({
      status: "Shipped",
      updatedAt: new Date(),
    });

    order.internalNotes.push({
      note: `Dispatched via ${courierPartner} (AWB: ${awbTrackingNumber})`,
      addedBy: req.user?.firstName ? `${req.user.firstName} (${req.user.role})` : req.user?.email || "System",
      createdAt: new Date(),
    });

    await order.save();

    await logAudit(req, "DISPATCH_ORDER", "Fulfillment & Shipping", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      courierPartner,
      awbTrackingNumber,
    });

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} successfully marked as Shipped.`,
      order,
    });
  } catch (error) {
    console.error("Dispatch Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to dispatch order.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update Order Transit Status
 * @route   PUT /api/shipping/orders/:id/transit-status
 * @access  Private (Shipping Manager, Super Admin, Admin)
 */
export const updateTransitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { transitStatus, note } = req.body;

    if (!transitStatus) {
      return res.status(400).json({
        success: false,
        message: "Transit status is required.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.transitStatus = transitStatus;

    if (transitStatus === "Delivered") {
      order.orderStatus = "Delivered";
      order.deliveredAt = new Date();
      order.paymentStatus = "Paid"; // If COD, update on delivery
    } else if (transitStatus.startsWith("RTO")) {
      order.orderStatus = "Return Requested";
    }

    if (note) {
      order.internalNotes.push({
        note: `Transit Status changed to '${transitStatus}': ${note}`,
        addedBy: req.user?.firstName ? `${req.user.firstName} (${req.user.role})` : req.user?.email || "System",
        createdAt: new Date(),
      });
    }

    await order.save();

    await logAudit(req, "UPDATE_TRANSIT_STATUS", "Fulfillment & Shipping", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      transitStatus,
    });

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} transit status updated to ${transitStatus}.`,
      order,
    });
  } catch (error) {
    console.error("Update Transit Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update transit status.",
      error: error.message,
    });
  }
};

/**
 * @desc    Generate Shipping Batch Manifest
 * @route   POST /api/shipping/manifests
 * @access  Private (Shipping Manager, Super Admin, Admin)
 */
export const generateManifest = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one order to generate a shipping manifest.",
      });
    }

    const manifestId = `MAN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { shippingManifestId: manifestId } }
    );

    const orders = await Order.find({ _id: { $in: orderIds } }).populate("user", "firstName lastName email phone");

    await logAudit(req, "GENERATE_MANIFEST", "Fulfillment & Shipping", {
      manifestId,
      orderCount: orders.length,
    });

    return res.status(200).json({
      success: true,
      message: `Shipping manifest ${manifestId} generated for ${orders.length} order(s).`,
      manifestId,
      manifestDate: new Date(),
      orders,
    });
  } catch (error) {
    console.error("Generate Manifest Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate shipping manifest.",
      error: error.message,
    });
  }
};

/**
 * @desc    Add Internal Logistics Note
 * @route   POST /api/shipping/orders/:id/notes
 * @access  Private (Shipping Manager, Super Admin, Admin)
 */
export const addInternalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content cannot be empty.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.internalNotes.push({
      note: note.trim(),
      addedBy: req.user?.firstName ? `${req.user.firstName} (${req.user.role})` : req.user?.email || "System",
      createdAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Internal note added.",
      internalNotes: order.internalNotes,
    });
  } catch (error) {
    console.error("Add Internal Note Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add note.",
      error: error.message,
    });
  }
};
