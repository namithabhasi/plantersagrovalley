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
  Select,
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

  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (name, value, currentFormData = formData) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d{7,15}$/.test(value.trim())) {
          error = "Phone number must be between 7 and 15 digits";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Confirm password is required";
        } else if (value !== currentFormData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", formData.firstName, formData),
      lastName: validateField("lastName", formData.lastName, formData),
      email: validateField("email", formData.email, formData),
      phone: validateField("phone", formData.phone, formData),
      password: validateField("password", formData.password, formData),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword, formData),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: value,
      };
      validateField(name, value, nextData);
      
      if (name === "password" && nextData.confirmPassword) {
        validateField("confirmPassword", nextData.confirmPassword, nextData);
      }
      return nextData;
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    setFormData((prev) => {
      const nextData = {
        ...prev,
        phone: cleaned,
      };
      validateField("phone", cleaned, nextData);
      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return toast.error("Please correct the errors in the form before submitting.");
    }

    try {
      setLoading(true);

      await axios.post(
        "/admin/users",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${countryCode}${formData.phone}`,
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
      setCountryCode("+91");
      setErrors({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
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
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              "&:hover": {
                borderColor: "var(--color-primary-dark)",
                bgcolor: "var(--color-primary-subtle)",
              },
              textTransform: "none",
              borderRadius: "var(--radius-lg)",
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
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-lg)",
          borderColor: "var(--color-border)",
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
           <Typography
  variant="h6"
  fontWeight={700}
  sx={{ color: "#fff" }}
>
  User Profile Information
</Typography>

<Typography
  variant="caption"
  sx={{ color: "#fff" }}
>
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
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  onChange={handlePhoneChange}
                  required
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ gap: 0.5 }}>
                          <Phone fontSize="small" color="action" />
                          <Select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              "& .MuiSelect-select": {
                                paddingRight: "18px !important",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              },
                            }}
                          >
                            <MenuItem value="+91">🇮🇳 +91</MenuItem>
                            <MenuItem value="+1">🇺🇸 +1</MenuItem>
                            <MenuItem value="+44">🇬🇧 +44</MenuItem>
                            <MenuItem value="+971">🇦🇪 +971</MenuItem>
                            <MenuItem value="+966">🇸🇦 +966</MenuItem>
                            <MenuItem value="+968">🇴🇲 +968</MenuItem>
                            <MenuItem value="+974">🇶🇦 +974</MenuItem>
                            <MenuItem value="+973">🇧🇭 +973</MenuItem>
                            <MenuItem value="+965">🇰🇼 +965</MenuItem>
                            <MenuItem value="+61">🇦🇺 +61</MenuItem>
                            <MenuItem value="+65">🇸🇬 +65</MenuItem>
                            <MenuItem value="+60">🇲🇾 +60</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
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
                  color: "var(--color-primary)",
                  borderColor: "var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  textTransform: "none",
                  px: 3,
                  height: 40,
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    bgcolor: "var(--color-primary-subtle)",
                  },
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
                  bgcolor: "var(--color-primary)",
                  "&:hover": { bgcolor: "var(--color-primary-dark)", boxShadow: "none" },
                  textTransform: "none",
                  borderRadius: "var(--radius-lg)",
                  px: 2,
                  height: 40,
                  boxShadow: "none",
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