import Grid from "@mui/material/Grid";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import StatCard from "./StatCard";

const DashboardCards = ({ statistics = {} }) => {
  const {
    totalUsers = 0,
    totalProducts = 0,
    totalCategories = 0,
    totalOrders = 0,
    totalRevenue = 0,
    lowStockProducts = 0,
  } = statistics;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Users"
          value={totalUsers}
          icon={<PeopleIcon fontSize="large" />}
          color="#1976d2"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Products"
          value={totalProducts}
          icon={<Inventory2Icon fontSize="large" />}
          color="#2e7d32"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={<CategoryIcon fontSize="large" />}
          color="#ed6c02"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Orders"
          value={totalOrders}
          icon={<ShoppingCartIcon fontSize="large" />}
          color="#9c27b0"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Revenue"
          value={`₹${Number(totalRevenue).toLocaleString()}`}
          icon={<CurrencyRupeeIcon fontSize="large" />}
          color="#0288d1"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <StatCard
          title="Low Stock"
          value={lowStockProducts}
          icon={<WarningAmberIcon fontSize="large" />}
          color="#d32f2f"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardCards;