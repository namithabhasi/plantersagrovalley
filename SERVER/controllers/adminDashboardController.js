import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      totalRevenueData,
      todayRevenueData,
      recentOrders,
      totalAdmins,
      totalShippingManagers,
      packedOrders,
      shippedOrders,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
        isActive: true,
      }),

      Product.countDocuments({
        isDeleted: false,
      }),

      Category.countDocuments({
        isDeleted: false,
      }),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "Pending",
      }),

      Order.countDocuments({
        orderStatus: "Delivered",
      }),

      Order.countDocuments({
        orderStatus: "Cancelled",
      }),

      Product.countDocuments({
        stock: { $lt: 5 },
        isDeleted: false,
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            todayRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.find()
        .populate("user", "firstName lastName email phone")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      User.countDocuments({
        role: "admin",
        isActive: true,
      }),

      User.countDocuments({
        role: "shipping-manager",
        isActive: true,
      }),

      Order.countDocuments({
        orderStatus: "Packed",
      }),

      Order.countDocuments({
        orderStatus: "Shipped",
      }),
    ]);

    // Monthly Sales (Last 12 Months)
    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          sales: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Top Selling Products
    const topSellingProducts = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          quantitySold: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          quantitySold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          productName: "$product.name",
          quantitySold: 1,
          stock: "$product.stock",
          price: "$product.price",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalCustomers: totalUsers,
          totalProducts,
          totalCategories,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          lowStockProducts,
          totalRevenue:
            totalRevenueData.length > 0
              ? totalRevenueData[0].totalRevenue
              : 0,
          todayRevenue:
            todayRevenueData.length > 0
              ? todayRevenueData[0].todayRevenue
              : 0,
          totalAdmins,
          totalShippingManagers,
          packedOrders,
          shippedOrders,
        },

        recentOrders,

        monthlySales,

        topSellingProducts,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};