import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Person,
  Email,
  Phone,
  Lock,
  AdminPanelSettings,
  ToggleOn,
  PersonAdd,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await axios.post(
        "/admin/users",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive,
        }
      );

      toast.success("User created successfully");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "admin",
        isActive: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mb: 4,
          gap: 2,
        }}
      >
        {/* Back button */}
        <Box
          sx={{
            position: { xs: "static", sm: "absolute" },
            left: 0,
            top: "50%",
            transform: { sm: "translateY(-50%)" },
            order: { xs: 2, sm: 1 },
          }}
        >
          <Button
            component={Link}
            to="/dashboard/users"
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              color: "success.main",
              borderColor: "success.main",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "success.light",
              },
              textTransform: "none",
              borderRadius: 2.5,
              px: 3,
              height: 40,
            }}
          >
            Back to List
          </Button>
        </Box>

        {/* Title & Description */}
        <Box
          sx={{
            textAlign: "center",
            order: { xs: 1, sm: 2 },
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
            Add New User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register a new system user, customer, or administrator.
          </Typography>
        </Box>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        {/* Card Header Banner */}
        <Box
          sx={{
            bgcolor: "success.light",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Avatar sx={{ bgcolor: "success.main" }}>
            <PersonAdd />
          </Avatar>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" fontWeight={700} color="success.main">
              User Profile Information
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fill in the credential and personal details of the new account.
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AdminPanelSettings fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value="shipping-manager">Shipping Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super-admin">Super Admin</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="isActive"
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value,
                    })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ToggleOn fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>

             <Stack
              direction="row"
              spacing={2}
              
              sx={{
                width: "100%",
                justifyContent: "flex-end",
                mt:4
              }}
            >
              <Button
                component={Link}
                to="/dashboard/users"
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  px: 3,
                  height: 40,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
                sx={{
                  bgcolor: "success.main",
                  "&:hover": { bgcolor: "primary.main" },
                  textTransform: "none",
                  borderRadius: 2.5,
                  px: 2,
                  height: 40,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
                }}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser;