import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../COMPONENTS/admin/layout/AdminNavbar";
import Sidebar from "../COMPONENTS/admin/layout/Sidebar";

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Right Section */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          ml: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Navbar */}
        <Navbar handleDrawerToggle={handleDrawerToggle} />

        {/* Page Content */}
        <Box
          sx={{
            mt: "64px",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;