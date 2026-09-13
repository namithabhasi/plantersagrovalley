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
  MarkEmailRead,
  SupportAgent,
  RestoreFromTrash,
  History,
  Security,
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
  const [permissions, setPermissions] = useState(null);
  const [allRoles, setAllRoles] = useState([]);

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

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const { data } = await axiosInstance.get("/roles");
        if (data.success && data.roles) {
          setAllRoles(data.roles);
          if (role) {
            const cleanRole = String(role).toLowerCase().trim().replace(/[-_]/g, "");
            if (cleanRole === "superadmin") {
              setPermissions({
                userManagement: "ALLOW",
                roleManagement: "ALLOW",
                systemGovernance: "ALLOW",
                catalogManagement: "ALLOW",
                inventoryControl: "ALLOW",
                orderLifecycle: "ALLOW",
                fulfillmentShipping: "ALLOW",
                marketingSales: "ALLOW",
                reportsDashboard: "ALLOW",
                crmSupport: "ALLOW",
              });
            } else {
              const myRole = data.roles.find(
                (r) =>
                  r.code?.toLowerCase().replace(/[-_]/g, "") === cleanRole ||
                  r.name?.toLowerCase().replace(/[-_]/g, "") === cleanRole
              );
              if (myRole && myRole.permissions) {
                setPermissions(myRole.permissions);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load roles/permissions in Sidebar", error);
      }
    };

    fetchRolesAndPermissions();
  }, [role, location.pathname]);

  const isAllowed = (permKey) => {
    const cleanRole = role ? String(role).toLowerCase().trim().replace(/[-_]/g, "") : "";
    if (cleanRole === "superadmin") return true;
    if (!permissions) return true; // Default fallback while loading
    return permissions[permKey] === "ALLOW";
  };

  const getRoleIcon = (code) => {
    switch (code) {
      case "super-admin": return <AdminPanelSettings />;
      case "admin": return <ManageAccounts />;
      case "shipping-manager": return <LocalShipping />;
      default: return <Person />;
    }
  };

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
        <Box
          component={Link}
          to="/"
          title="Go to Home Page"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
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
        </Box>
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

        {isAllowed("userManagement") && (
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

                {allRoles.length > 0 ? (
                  allRoles.map((r) => (
                    <ListItemButton
                      key={r.code}
                      sx={{
                        pl: 4,
                        ...(location.pathname === `/dashboard/users/${r.code}s` || location.pathname === `/dashboard/users/role/${r.code}` ? activeStyle : {}),
                      }}
                      component={Link}
                      to={
                        ["super-admin", "admin", "shipping-manager", "customer"].includes(r.code)
                          ? `/dashboard/users/${r.code}s`
                          : `/dashboard/users/role/${r.code}`
                      }
                      onClick={handleItemClick}
                    >
                      <ListItemIcon>
                        {getRoleIcon(r.code)}
                      </ListItemIcon>
                      <ListItemText primary={r.name.endsWith('s') ? r.name : `${r.name}s`} />
                    </ListItemButton>
                  ))
                ) : (
                  <>
                    <ListItemButton sx={{ pl: 4, ...(location.pathname === "/dashboard/users/super-admins" ? activeStyle : {}) }} component={Link} to="/dashboard/users/super-admins" onClick={handleItemClick}>
                      <ListItemIcon><AdminPanelSettings /></ListItemIcon>
                      <ListItemText primary="Super Admins" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4, ...(location.pathname === "/dashboard/users/admins" ? activeStyle : {}) }} component={Link} to="/dashboard/users/admins" onClick={handleItemClick}>
                      <ListItemIcon><ManageAccounts /></ListItemIcon>
                      <ListItemText primary="Admins" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4, ...(location.pathname === "/dashboard/users/shipping-managers" ? activeStyle : {}) }} component={Link} to="/dashboard/users/shipping-managers" onClick={handleItemClick}>
                      <ListItemIcon><LocalShipping /></ListItemIcon>
                      <ListItemText primary="Shipping Managers" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4, ...(location.pathname === "/dashboard/users/customers" ? activeStyle : {}) }} component={Link} to="/dashboard/users/customers" onClick={handleItemClick}>
                      <ListItemIcon><Person /></ListItemIcon>
                      <ListItemText primary="Customers" />
                    </ListItemButton>
                  </>
                )}

              </List>
            </Collapse>
          </>
        )}

        {/* Catalog */}

        {(isAllowed("catalogManagement") || isAllowed("inventoryControl")) && (
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

                {isAllowed("catalogManagement") && (
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
                )}

                {isAllowed("inventoryControl") && (
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
                )}

                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === "/dashboard/recycle-bin" ? activeStyle : {}),
                  }}
                  component={Link}
                  to="/dashboard/recycle-bin"
                  onClick={handleItemClick}
                >
                  <ListItemIcon>
                    <RestoreFromTrash />
                  </ListItemIcon>

                  <ListItemText primary="Recycle Bin" />
                </ListItemButton>

              </List>
            </Collapse>
          </>
        )}

        {/* Orders */}

        {isAllowed("orderLifecycle") && (
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
        )}

        {/* Logistics & Shipping */}
        {isAllowed("fulfillmentShipping") && (
          <ListItemButton
            component={Link}
            to="/dashboard/shipping"
            sx={
              location.pathname === "/dashboard/shipping"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>

            <ListItemText primary="Logistics & Shipping" />
          </ListItemButton>
        )}

        {/* Coupons */}

        {isAllowed("marketingSales") && (
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

        {isAllowed("crmSupport") && (
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

        {/* Live Chat Support */}
        {isAllowed("crmSupport") && (
          <ListItemButton
            component={Link}
            to="/dashboard/chat-support"
            sx={
              location.pathname === "/dashboard/chat-support"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <SupportAgent />
            </ListItemIcon>

            <ListItemText primary="Live Chat" />
          </ListItemButton>
        )}

        {/* Subscribers */}

        {isAllowed("crmSupport") && (
          <ListItemButton
            component={Link}
            to="/dashboard/subscribers"
            sx={
              location.pathname === "/dashboard/subscribers"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <MarkEmailRead />
            </ListItemIcon>

            <ListItemText primary="Subscribers" />
          </ListItemButton>
        )}

        {/* Blogs */}

        {(isAllowed("marketingSales") || isAllowed("catalogManagement")) && (
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

        {(isAllowed("marketingSales") || isAllowed("catalogManagement")) && (
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

        {isAllowed("reportsDashboard") && (
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

        {/* Roles & Governance */}

        {isAllowed("roleManagement") && (
          <ListItemButton
            component={Link}
            to="/dashboard/roles"
            sx={
              location.pathname === "/dashboard/roles"
                ? activeStyle
                : {}
            }
            onClick={handleItemClick}
          >
            <ListItemIcon>
              <Security />
            </ListItemIcon>

            <ListItemText primary="Roles & Governance" />
          </ListItemButton>
        )}

        {/* System Audit Logs & Settings */}

        {isAllowed("systemGovernance") && (
          <>
            <ListItemButton
              component={Link}
              to="/dashboard/audit-logs"
              sx={
                location.pathname === "/dashboard/audit-logs"
                  ? activeStyle
                  : {}
              }
              onClick={handleItemClick}
            >
              <ListItemIcon>
                <History />
              </ListItemIcon>

              <ListItemText primary="System Audit Logs" />
            </ListItemButton>

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
          </>
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