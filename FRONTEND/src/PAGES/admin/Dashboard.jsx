import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboard } from "../../redux/dashboard/dashboardSlice";

import DashboardCards from "../../COMPONENTS/admin/dashboard/DashboardCards";
import SalesChart from "../../COMPONENTS/admin/dashboard/SalesChart";
import RecentOrders from "../../COMPONENTS/admin/dashboard/RecentOrders";
import TopProducts from "../../COMPONENTS/admin/dashboard/TopProducts";

const SuperAdminDashboard = ({ statistics, monthlySales, recentOrders, topSellingProducts }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Super Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome to the Planters Agro Valley Administration Panel
      </Typography>

      <DashboardCards role="super-admin" statistics={statistics} />

      <Box mt={4}>
        <SalesChart monthlySales={monthlySales} />
      </Box>

      <Box
        mt={4}
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          lg: "2fr 1fr",
        }}
        gap={3}
      >
        <RecentOrders orders={recentOrders} />
        <TopProducts products={topSellingProducts} />
      </Box>
    </Box>
  );
};

const AdminDashboard = ({ statistics, monthlySales, recentOrders, topSellingProducts }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome to the Planters Agro Valley Administration Panel
      </Typography>

      <DashboardCards role="admin" statistics={statistics} />

      <Box mt={4}>
        <SalesChart monthlySales={monthlySales} />
      </Box>

      <Box
        mt={4}
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          lg: "2fr 1fr",
        }}
        gap={3}
      >
        <RecentOrders orders={recentOrders} />
        <TopProducts products={topSellingProducts} />
      </Box>
    </Box>
  );
};

const ShippingDashboard = ({ statistics, recentOrders }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Shipping Manager Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome to the Planters Agro Valley Shipment Management Panel
      </Typography>

      <DashboardCards role="shipping-manager" statistics={statistics} />

      <Box mt={4}>
        <RecentOrders orders={recentOrders} />
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const {
    statistics,
    recentOrders,
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" p={3}>
        {error}
      </Typography>
    );
  }

  if (role === "super-admin") {
    return (
      <SuperAdminDashboard
        statistics={statistics}
        monthlySales={monthlySales}
        recentOrders={recentOrders}
        topSellingProducts={topSellingProducts}
      />
    );
  }

  if (role === "admin") {
    return (
      <AdminDashboard
        statistics={statistics}
        monthlySales={monthlySales}
        recentOrders={recentOrders}
        topSellingProducts={topSellingProducts}
      />
    );
  }

  if (role === "shipping-manager") {
    return (
      <ShippingDashboard
        statistics={statistics}
        recentOrders={recentOrders}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">
        Access Denied. You do not have permission to view the dashboard.
      </Typography>
    </Box>
  );
};

export default Dashboard;