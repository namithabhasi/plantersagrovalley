import Grid from "@mui/material/Grid";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryIcon from "@mui/icons-material/Category";

import StatCard from "./StatCard";

const DashboardCards = ({ role = "super-admin", statistics = {} }) => {
  const {
    totalCustomers = 0,
    totalUsers = 0, // Fallback for customers
    totalProducts = 0,
    totalCategories = 0,
    totalOrders = 0,
    totalRevenue = 0,
    totalAdmins = 0,
    totalShippingManagers = 0,
    pendingOrders = 0,
    packedOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
  } = statistics;

  const customersCount = totalCustomers || totalUsers;

  if (role === "super-admin") {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`₹${Number(totalRevenue).toLocaleString()}`}
            icon={<CurrencyRupeeIcon fontSize="large" />}
            color="#0288d1"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory2Icon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard
            title="Total Categories"
            value={totalCategories}
            icon={<CategoryIcon fontSize="large" />}
            color="#00bcd4"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <StatCard
            title="Total Customers"
            value={customersCount}
            icon={<PeopleIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <StatCard
            title="Total Admins"
            value={totalAdmins}
            icon={<AdminPanelSettingsIcon fontSize="large" />}
            color="#e91e63"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <StatCard
            title="Total Shipping Managers"
            value={totalShippingManagers}
            icon={<LocalShippingIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>
    );
  }

  if (role === "admin") {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Revenue"
            value={`₹${Number(totalRevenue).toLocaleString()}`}
            icon={<CurrencyRupeeIcon fontSize="large" />}
            color="#0288d1"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Orders"
            value={totalOrders}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Products"
            value={totalProducts}
            icon={<Inventory2Icon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Categories"
            value={totalCategories}
            icon={<CategoryIcon fontSize="large" />}
            color="#00bcd4"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Customers"
            value={customersCount}
            icon={<PeopleIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
      </Grid>
    );
  }

  if (role === "shipping-manager") {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<HourglassEmptyIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Packed Orders"
            value={packedOrders}
            icon={<ArchiveIcon fontSize="large" />}
            color="#008080"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Shipped Orders"
            value={shippedOrders}
            icon={<LocalShippingIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Delivered Orders"
            value={deliveredOrders}
            icon={<CheckCircleIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>
    );
  }

  return null;
};

export default DashboardCards;