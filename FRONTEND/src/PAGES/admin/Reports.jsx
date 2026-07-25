import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as RevenueIcon,
  ShoppingCart as OrderIcon,
  People as CustomerIcon,
  Warning as LowStockIcon,
  CheckCircle as DeliveryIcon,
} from "@mui/icons-material";
import { fetchDashboard } from "../../redux/dashboard/dashboardSlice";

const MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Reports = () => {
  const dispatch = useDispatch();
  const {
    statistics,
    monthlySales,
    topSellingProducts,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: "70vh" }}>
        <CircularProgress color="success" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Format Monthly Sales Chart Data
  const salesChartData = (monthlySales || []).map((item) => ({
    name: item._id ? `${MonthNames[item._id.month - 1]} ${item._id.year}` : "",
    Sales: item.sales || 0,
    Orders: item.orders || 0,
  }));

  // Format Top Selling Products Chart Data
  const topProductsData = (topSellingProducts || []).map((item) => ({
    name: item.productName?.length > 15 ? `${item.productName.substring(0, 15)}...` : item.productName,
    "Units Sold": item.quantitySold || 0,
    Revenue: (item.quantitySold || 0) * (item.price || 0),
  }));

  // Format Order Status Pie Chart Data
  const pieChartData = [
    { name: "Delivered", value: statistics?.deliveredOrders || 0, color: "#2e7d32" },
    { name: "Pending", value: statistics?.pendingOrders || 0, color: "#f57c00" },
    { name: "Cancelled", value: statistics?.cancelledOrders || 0, color: "#d32f2f" },
  ].filter((item) => item.value > 0);

  const totalPieValue = pieChartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#1b5e20", mb: 0.5 }}>
            Analytics & Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View store statistics, revenue trends, inventory alerts, and product sales performance
          </Typography>
        </Box>
      </Stack>

      {/* Metrics Cards Grid */}
      <Grid container spacing={3} mb={4}>
        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL SALES</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: "#2e7d32" }}>
                    ${statistics?.totalRevenue?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Paper sx={{ p: 1, bgcolor: "#e8f5e9", color: "#2e7d32", borderRadius: 2, display: "flex" }} elevation={0}>
                  <RevenueIcon />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Sales */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>TODAY'S REVENUE</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: "#1b5e20" }}>
                    ${statistics?.todayRevenue?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Paper sx={{ p: 1, bgcolor: "#f1f8e9", color: "#1b5e20", borderRadius: 2, display: "flex" }} elevation={0}>
                  <TrendingUpIcon />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL ORDERS</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
                    {statistics?.totalOrders || 0}
                  </Typography>
                </Box>
                <Paper sx={{ p: 1, bgcolor: "#e3f2fd", color: "#1565c0", borderRadius: 2, display: "flex" }} elevation={0}>
                  <OrderIcon />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Deliveries */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>DELIVERED</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: "#2e7d32" }}>
                    {statistics?.deliveredOrders || 0}
                  </Typography>
                </Box>
                <Paper sx={{ p: 1, bgcolor: "#e8f5e9", color: "#2e7d32", borderRadius: 2, display: "flex" }} elevation={0}>
                  <DeliveryIcon />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>LOW INVENTORY</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: "#d32f2f" }}>
                    {statistics?.lowStockProducts || 0} items
                  </Typography>
                </Box>
                <Paper sx={{ p: 1, bgcolor: "#ffebee", color: "#c62828", borderRadius: 2, display: "flex" }} elevation={0}>
                  <LowStockIcon />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Sales & Orders Trend Area Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.02)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Sales & Order Volume Trends
              </Typography>
              <Box sx={{ height: 350 }}>
                {salesChartData.length === 0 ? (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <Typography color="text.secondary">No monthly sales history found.</Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                      <ChartTooltip formatter={(value) => [`$${value}`, "Sales"]} />
                      <Legend verticalAlign="top" height={36} />
                      <Area type="monotone" dataKey="Sales" stroke="#2e7d32" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.02)", border: "1px solid #f0f0f0", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Order Ratios By Status
              </Typography>
              <Box sx={{ height: 260, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {totalPieValue === 0 ? (
                  <Typography color="text.secondary">No orders to display.</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value) => [value, "Orders"]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
              <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                {pieChartData.map((item, index) => (
                  <Stack key={index} direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 10, height: 10, bgcolor: item.color, borderRadius: "50%" }} />
                    <Typography variant="caption" color="text.secondary">
                      {item.name} ({item.value})
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second Charts Row */}
      <Grid container spacing={3}>
        {/* Top Products Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.02)", border: "1px solid #f0f0f0" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Top 5 Best Selling Products (Volume & Revenue)
              </Typography>
              <Box sx={{ height: 350 }}>
                {topProductsData.length === 0 ? (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <Typography color="text.secondary">No sales transactions logged yet.</Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={topProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                      <ChartTooltip formatter={(value, name) => [name === "Revenue" ? `$${value}` : value, name]} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="Units Sold" fill="#81c784" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Revenue" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
