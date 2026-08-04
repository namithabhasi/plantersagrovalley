import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { clearUser } from "../../../redux/auth/authSlice";
import { setSearchQuery, clearSearchQuery } from "../../../redux/search/searchSlice";

const AdminNavbar = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const drawerWidth = 260;

  const { user } = useSelector((state) => state.auth);
  const globalSearchQuery = useSelector((state) => state.search.query);

  const searchContainerRef = useRef(null);
  const skipClearRef = useRef(false);

  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState({
    products: [],
    orders: [],
    categories: [],
    users: [],
  });
  const [searchLoading, setSearchLoading] = useState(false);

  // Search logic: Clear search on route change (unless navigation came from clicking a search result)
  useEffect(() => {
    if (skipClearRef.current) {
      skipClearRef.current = false;
      return;
    }
    dispatch(clearSearchQuery());
  }, [location.pathname, dispatch]);

  // Global search fetch with debounce
  useEffect(() => {
    if (!globalSearchQuery.trim()) {
      setSearchResults({ products: [], orders: [], categories: [], users: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await axiosInstance.get(`/admin/global-search?query=${globalSearchQuery}`);
        if (data.success) {
          setSearchResults(data.results || { products: [], orders: [], categories: [], users: [] });
        }
      } catch (error) {
        console.error("Global search fetch failed", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [globalSearchQuery]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    if (searchContainerRef.current) {
      setSearchAnchorEl(searchContainerRef.current);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchAnchorEl(null);
      const searchPages = [
        "/dashboard/products",
        "/dashboard/orders",
        "/dashboard/categories",
        "/dashboard/coupons",
        "/dashboard/users",
      ];
      if (!searchPages.some((path) => location.pathname.startsWith(path))) {
        navigate("/dashboard/products");
      }
    }
  };

  const handleSearchResultClick = (path, filterQuery) => {
    setSearchAnchorEl(null);
    skipClearRef.current = true;
    dispatch(setSearchQuery(filterQuery));
    navigate(path);
  };

  // Profile menu logic
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = async () => {
    setLogoutConfirmOpen(false);
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  // Notifications logic
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const fetchNavbarNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/notifications");
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNavbarNotifications();
    }
  }, [user]);

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.put("/admin/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCartIcon color="primary" />;
      case "inventory":
        return <InventoryIcon color="warning" />;
      case "review":
        return <RateReviewIcon color="info" />;
      default:
        return <SettingsIcon color="action" />;
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        left: { xs: 0, md: `${drawerWidth}px` },
        right: 0,
        bgcolor: "#fff",
        color: "#333",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          ref={searchContainerRef}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f4f6f8",
            px: 2,
            borderRadius: 2,
            width: { xs: 140, sm: 250, md: 350 },
            mr: { xs: 1, sm: 0 },
          }}
        >
          <SearchIcon color="action" />

          <InputBase
            placeholder="Search..."
            sx={{ ml: 1, flex: 1 }}
            value={globalSearchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={(e) => {
              if (globalSearchQuery.trim()) {
                setSearchAnchorEl(searchContainerRef.current);
              }
            }}
          />
        </Box>

        {/* Global Search Popover */}
        <Popover
          open={Boolean(globalSearchQuery && searchAnchorEl)}
          anchorEl={searchAnchorEl}
          onClose={() => setSearchAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            sx: {
              width: { xs: "90vw", sm: 450 },
              maxHeight: 500,
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              mt: 1,
              p: 1,
            },
          }}
        >
          {searchLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} color="success" />
            </Box>
          ) : (
            <Box sx={{ maxHeight: 480, overflowY: "auto" }}>
              {/* Products Section */}
              {searchResults.products.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ px: 2, py: 0.5, display: "block" }}>
                    PRODUCTS
                  </Typography>
                  <List size="small" disablePadding>
                    {searchResults.products.map((p) => (
                      <ListItem
                        key={p._id}
                        onClick={() => handleSearchResultClick("/dashboard/products", p.name)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <Avatar
                          src={p.images?.[0]?.url || ""}
                          variant="rounded"
                          sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "#e8f5e9" }}
                        >
                          <InventoryIcon fontSize="small" sx={{ color: "var(--color-primary-light)" }} />
                        </Avatar>
                        <ListItemText
                          primary={p.name}
                          secondary={`SKU: ${p.sku} • $${p.salePrice || p.price}`}
                          primaryTypographyProps={{ variant: "body2", fontWeight: "medium" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              )}

              {/* Orders Section */}
              {searchResults.orders.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ px: 2, py: 0.5, display: "block" }}>
                    ORDERS
                  </Typography>
                  <List size="small" disablePadding>
                    {searchResults.orders.map((o) => (
                      <ListItem
                        key={o._id}
                        onClick={() => handleSearchResultClick("/dashboard/orders", o.orderNumber)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "#e3f2fd" }}>
                          <ShoppingCartIcon fontSize="small" color="primary" />
                        </Avatar>
                        <ListItemText
                          primary={`Order #${o.orderNumber}`}
                          secondary={`Customer: ${o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest"} • Total: $${o.totalAmount.toFixed(2)}`}
                          primaryTypographyProps={{ variant: "body2", fontWeight: "medium" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              )}

              {/* Categories Section */}
              {searchResults.categories.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ px: 2, py: 0.5, display: "block" }}>
                    CATEGORIES
                  </Typography>
                  <List size="small" disablePadding>
                    {searchResults.categories.map((c) => (
                      <ListItem
                        key={c._id}
                        onClick={() => handleSearchResultClick("/dashboard/categories", c.name)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "#fff3e0" }}>
                          <CategoryIcon fontSize="small" color="warning" />
                        </Avatar>
                        <ListItemText
                          primary={c.name}
                          primaryTypographyProps={{ variant: "body2", fontWeight: "medium" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              )}

              {/* Users Section */}
              {searchResults.users.length > 0 && (
                <Box sx={{ mb: 0 }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ px: 2, py: 0.5, display: "block" }}>
                    USERS / CUSTOMERS
                  </Typography>
                  <List size="small" disablePadding>
                    {searchResults.users.map((u) => (
                      <ListItem
                        key={u._id}
                        onClick={() => handleSearchResultClick("/dashboard/users", u.email)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "#f3e5f5" }}>
                          <PeopleIcon fontSize="small" color="secondary" />
                        </Avatar>
                        <ListItemText
                          primary={`${u.firstName} ${u.lastName}`}
                          secondary={`${u.email} • Role: ${u.role}`}
                          primaryTypographyProps={{ variant: "body2", fontWeight: "medium" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {searchResults.products.length === 0 &&
               searchResults.orders.length === 0 &&
               searchResults.categories.length === 0 &&
               searchResults.users.length === 0 && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No results found for "{globalSearchQuery}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Popover>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Popover
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: { xs: "90vw", sm: 360 },
              maxHeight: 480,
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              mt: 1.5,
            },
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                startIcon={<DoneAllIcon fontSize="small" />}
                sx={{ textTransform: "none", color: "success.main" }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, overflowY: "auto", maxHeight: 380 }}>
              {notifications.map((notif) => (
                <Box key={notif._id}>
                  <ListItem
                    onClick={() => handleMarkAsRead(notif._id)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: notif.isRead ? "transparent" : "#f4fcf4",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "#f0f7f0",
                      },
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>{getNotificationIcon(notif.type)}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={notif.isRead ? "normal" : "bold"}
                        color="text.primary"
                      >
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5 }}>
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="default"
                      onClick={(e) => handleDeleteNotification(notif._id, e)}
                      sx={{ alignSelf: "center", "&:hover": { color: "#d32f2f" } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Popover>

        <Box
          onClick={handleProfileClick}
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 3,
            cursor: "pointer",
            p: 0.5,
            borderRadius: 2,
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: "#f4f6f8",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "success.main",
              mr: 1,
            }}
          >
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "S"}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              fontWeight="bold"
              fontSize={14}
            >
              {user ? `${user.firstName} ${user.lastName}` : "Super Admin"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {user ? user.email : "superadmin@planters.com"}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={profileAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              mt: 1.5,
            }
          }}
        >
          <MenuItem onClick={handleLogout} sx={{ py: 1, px: 2 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error" fontWeight="medium">Logout</Typography>
          </MenuItem>
        </Menu>

        <Dialog
          open={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                p: 3,
                maxWidth: 360,
                boxShadow: "0 12px 40px rgba(6, 42, 27, 0.15)",
                border: "1px solid rgba(6, 73, 45, 0.08)",
              },
            },
            backdrop: {
              sx: {
                backgroundColor: "rgba(6, 42, 27, 0.45)",
                backdropFilter: "blur(8px)",
              }
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, p: 0, mb: 1, color: "#06492D", fontSize: "1.25rem" }}>
            Confirm Logout
          </DialogTitle>
          <DialogContent sx={{ p: 0, mb: 3 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Are you sure you want to log out of your account?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 0, justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => setLogoutConfirmOpen(false)}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                border: "1px solid #ccc",
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                fontSize: "0.875rem",
                "&:hover": { bgcolor: "grey.100" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#06492D",
                color: "#fff",
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                fontSize: "0.875rem",
                "&:hover": { bgcolor: "#053d25" }
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;