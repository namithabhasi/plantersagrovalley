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
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
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
    role: "customer",
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
        role: "customer",
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

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Add User
        </Typography>

        <Button
          component={Link}
          to="/dashboard/users"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
      </Stack>

      <Card elevation={3}>
        <CardContent>

          <form onSubmit={handleSubmit}>

            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="customer">
                    Customer
                  </MenuItem>

                  <MenuItem value="shipping-manager">
                    Shipping Manager
                  </MenuItem>

                  <MenuItem value="admin">
                    Admin
                  </MenuItem>

                  <MenuItem value="super-admin">
                    Super Admin
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
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
                >
                  <MenuItem value={true}>
                    Active
                  </MenuItem>

                  <MenuItem value={false}>
                    Inactive
                  </MenuItem>
                </TextField>
              </Grid>

            </Grid>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              mt={4}
            >
              <Button
                component={Link}
                to="/dashboard/users"
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
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