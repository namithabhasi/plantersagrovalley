import { useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  People,
  AdminPanelSettings,
  ManageAccounts,
  LocalShipping,
  Person,
  Category,
  Inventory2,
  ShoppingCart,
  LocalOffer,
  BarChart,
  Settings,
} from "@mui/icons-material";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const Sidebar = () => {
  const location = useLocation();

  const [openUsers, setOpenUsers] = useState(false);
  const [openCatalog, setOpenCatalog] = useState(false);

  const activeStyle = {
    bgcolor: "#E8F5E9",
    color: "#2E7D32",
    "& .MuiListItemIcon-root": {
      color: "#2E7D32",
    },
  };

  return (
    <Box
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    bgcolor: "#fff",
    borderRight: "1px solid #e0e0e0",
    overflowY: "auto",
  }}
>
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="success.main"
        >
          🌿 Planters Admin
        </Typography>
      </Toolbar>

      <Divider />

      <List>

        {/* Dashboard */}

        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={
            location.pathname === "/dashboard"
              ? activeStyle
              : {}
          }
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* User Management */}

        <ListItemButton
          onClick={() => setOpenUsers(!openUsers)}
        >
          <ListItemIcon>
            <People />
          </ListItemIcon>

          <ListItemText primary="User Management" />

          {openUsers ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>

        <Collapse
          in={openUsers}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/users"
            >
              <ListItemIcon>
                <People />
              </ListItemIcon>

              <ListItemText primary="All Users" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/users/super-admins"
            >
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>

              <ListItemText primary="Super Admins" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/users/admins"
            >
              <ListItemIcon>
                <ManageAccounts />
              </ListItemIcon>

              <ListItemText primary="Admins" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/users/shipping-managers"
            >
              <ListItemIcon>
                <LocalShipping />
              </ListItemIcon>

              <ListItemText primary="Shipping Managers" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/users/customers"
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>

              <ListItemText primary="Customers" />
            </ListItemButton>

          </List>
        </Collapse>

        {/* Catalog */}

        <ListItemButton
          onClick={() => setOpenCatalog(!openCatalog)}
        >
          <ListItemIcon>
            <Inventory2 />
          </ListItemIcon>

          <ListItemText primary="Catalog" />

          {openCatalog ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>

        <Collapse
          in={openCatalog}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/categories"
            >
              <ListItemIcon>
                <Category />
              </ListItemIcon>

              <ListItemText primary="Categories" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/products"
            >
              <ListItemIcon>
                <Inventory2 />
              </ListItemIcon>

              <ListItemText primary="Products" />
            </ListItemButton>

          </List>
        </Collapse>

        {/* Orders */}

        <ListItemButton
          component={Link}
          to="/dashboard/orders"
        >
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>

          <ListItemText primary="Orders" />
        </ListItemButton>

        {/* Coupons */}

        <ListItemButton
          component={Link}
          to="/dashboard/coupons"
        >
          <ListItemIcon>
            <LocalOffer />
          </ListItemIcon>

          <ListItemText primary="Coupons" />
        </ListItemButton>

        {/* Reports */}

        <ListItemButton
          component={Link}
          to="/dashboard/reports"
        >
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>

          <ListItemText primary="Reports" />
        </ListItemButton>

        {/* Settings */}

        <ListItemButton
          component={Link}
          to="/dashboard/settings"
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>

          <ListItemText primary="Settings" />
        </ListItemButton>

      </List>
    </Box>
  );
};

export default Sidebar;