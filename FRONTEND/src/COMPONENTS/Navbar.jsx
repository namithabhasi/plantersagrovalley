import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.post("/auth/logout");
      if (data.success) {
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        color: "text.primary",
        mb: 2,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <AdminPanelSettingsIcon sx={{ color: "primary.main", fontSize: 32 }} />
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                Planters Agro Valley
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: -0.5 }}>
                Super Admin Panel
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
