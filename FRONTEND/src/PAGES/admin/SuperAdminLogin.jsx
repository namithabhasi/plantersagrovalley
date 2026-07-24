import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const SuperAdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/auth/login", formData);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Allow only Super Admin
      if (data.user.role !== "super-admin") {
        toast.error("Access denied. Super Admin only.");
        return;
      }

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={1}
            >
              Super Admin Login
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              mb={4}
            >
              Planters Agro Valley
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SuperAdminLogin;