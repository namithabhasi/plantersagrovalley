import { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
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
  Email,
  Book,
  Spa,
} from "@mui/icons-material";


import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [openUsers, setOpenUsers] = useState(false);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [logo, setLogo] = useState("");
  const [storeName, setStoreName] = useState("Planters Admin");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await axiosInstance.get("/settings");
        if (data.success && data.settings) {
          if (data.settings.storeLogo?.url) {
            setLogo(data.settings.storeLogo.url);
          }
          if (data.settings.storeName) {
            setStoreName(data.settings.storeName);
          }
        }
      } catch (error) {
        console.error("Failed to load settings logo/name in Sidebar", error);
      }
    };

    fetchLogo();
  }, []);

  const handleItemClick = () => {
    if (isMobile && handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const activeStyle = {
    bgcolor: "success.main",
    color: "#ffffff",
    "& .MuiListItemIcon-root": {
      color: "#ffffff",
    },
    "& .MuiListItemText-primary": {
      color: "#ffffff",
      fontWeight: "bold",
    },
    "&:hover": {
      bgcolor: "success.dark",
    },
  };

  const drawerContent = (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 1.5 }}>
        {logo ? (
          <Box
            component="img"
            src={logo}
            alt={storeName}
            sx={{
              height: 45,
              width: "auto",
              maxHeight: 50,
              maxWidth: 220,
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
          >
            🌿 {storeName}
          </Typography>
        )}
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
          onClick={handleItemClick}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* User Management */}

        {role === "super-admin" && (
          <>
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
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/users" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/users"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>

                  <ListItemText primary="All Users" />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/users/super-admins" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/users/super-admins"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>

                  <ListItemText primary="Super Admins" />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/users/admins" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/users/admins"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <ManageAccounts />
                  </ListItemIcon>

                  <ListItemText primary="Admins" />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/users/shipping-managers" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/users/shipping-managers"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <LocalShipping />
                  </ListItemIcon>

                  <ListItemText primary="Shipping Managers" />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/users/customers" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/users/customers"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>

                  <ListItemText primary="Customers" />
                </ListItemButton>

              </List>
            </Collapse>
          </>
        )}

        {/* Catalog */}

        {(role === "super-admin" || role === "admin") && (
          <>
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
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/categories" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/categories"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <Category />
                  </ListItemIcon>

                  <ListItemText primary="Categories" />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/products" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/products"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <Inventory2 />
                  </ListItemIcon>

                  <ListItemText primary="Products" />
                </ListItemButton>

              </List>
            </Collapse>
          </>
        )}

        {/* Orders */}

        <ListItemButton
          component={Link}
          to="/dashboard/orders"
          sx={
            location.pathname === "/dashboard/orders"
              ? activeStyle
              : {}
          }
          onClick={handleItemClick}
        >
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>

          <ListItemText primary="Orders" />
        </ListItemButton>

        {/* Coupons */}

        {(role === "super-admin" || role === "admin") && (
          <ListItemButton
            component={Link}
            to="/dashboard/coupons"
            sx={
              location.pathname === "/dashboard/coupons"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <LocalOffer />
            </ListItemIcon>

            <ListItemText primary="Coupons" />
          </ListItemButton>
        )}

        {/* Enquiries */}

        {(role === "super-admin" || role === "admin") && (
          <ListItemButton
            component={Link}
            to="/dashboard/enquiries"
            sx={
              location.pathname === "/dashboard/enquiries"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <Email />
            </ListItemIcon>

            <ListItemText primary="Enquiries" />
          </ListItemButton>
        )}

        {/* Blogs */}

        {(role === "super-admin" || role === "admin") && (
          <ListItemButton
            component={Link}
            to="/dashboard/blogs"
            sx={
              location.pathname === "/dashboard/blogs"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <Book />
            </ListItemIcon>

            <ListItemText primary="Blogs" />
          </ListItemButton>
        )}

        {(role === "super-admin" || role === "admin") && (
          <ListItemButton
            component={Link}
            to="/dashboard/services"
            sx={
              location.pathname === "/dashboard/services"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <Spa />
            </ListItemIcon>

            <ListItemText primary="Services" />
          </ListItemButton>
        )}

        {/* Reports */}

        {(role === "super-admin" || role === "admin") && (
          <ListItemButton
            component={Link}
            to="/dashboard/reports"
            sx={
              location.pathname === "/dashboard/reports"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>

            <ListItemText primary="Reports" />
          </ListItemButton>
        )}


        {/* Settings */}

        {role === "super-admin" && (
          <ListItemButton
            component={Link}
            to="/dashboard/settings"
            sx={
              location.pathname === "/dashboard/settings"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>
        )}

      </List>
    </Box>
  );

  return (
    <>
      {/* Temporary Drawer for mobile/tablet (xs to md) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer for desktop (md and up) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e0e0e0",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;