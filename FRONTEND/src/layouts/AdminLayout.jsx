import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../COMPONENTS/admin/layout/Adminnavbar";
import Sidebar from "../COMPONENTS/admin/layout/Sidebar";

const drawerWidth = 260;

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          ml: `${drawerWidth}px`,
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box
  sx={{
    mt: "64px",
    p: 3,
  }}
>
  <Outlet />
</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;