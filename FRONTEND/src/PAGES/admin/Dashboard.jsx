import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboard } from "../../redux/dashboard/dashboardSlice";

import DashboardCards from "../../COMPONENTS/admin/dashboard/DashboardCards";
import SalesChart from "../../COMPONENTS/admin/dashboard/SalesChart";
import RecentOrders from "../../COMPONENTS/admin/dashboard/RecentOrders";
import TopProducts from "../../COMPONENTS/admin/dashboard/TopProducts";

const Dashboard = () => {
  const dispatch = useDispatch();

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
      <Typography color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Super Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome to the Planters Agro Valley Administration Panel
      </Typography>

      <DashboardCards statistics={statistics} />

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

export default Dashboard;