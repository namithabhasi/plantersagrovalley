import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const drawerWidth = 260;

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      toast.success("Logged out successfully");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
   <AppBar
  position="fixed"
  elevation={1}
  sx={{
    width: `calc(100% - ${drawerWidth}px)`,
    ml: `${drawerWidth}px`,
    bgcolor: "#fff",
    color: "#333",
  }}
>
      <Toolbar>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mr: 4 }}
        >
          🌿 Planters Admin
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f4f6f8",
            px: 2,
            borderRadius: 2,
            width: 350,
          }}
        >
          <SearchIcon color="action" />

          <InputBase
            placeholder="Search..."
            sx={{ ml: 1, flex: 1 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <Badge badgeContent={5} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton>
          <DarkModeIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2e7d32",
              mr: 1,
            }}
          >
            S
          </Avatar>

          <Box>
            <Typography
              fontWeight="bold"
              fontSize={14}
            >
              Super Admin
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              superadmin@planters.com
            </Typography>
          </Box>
        </Box>

        <IconButton
          color="error"
          sx={{ ml: 2 }}
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;