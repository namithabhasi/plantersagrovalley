import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  InputAdornment,
} from "@mui/material";

import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

import axios from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const UserTable = ({ users, loading, onRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "customer",
    isActive: true,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [countryCode, setCountryCode] = useState("+91");

  const countryCodesList = ["+91", "+1", "+44", "+971", "+966", "+968", "+974", "+973", "+965", "+61", "+65", "+60"];

  const validateField = (name, value, currentForm = editForm) => {
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
        if (value && value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (currentForm.password && !value) {
          error = "Confirm password is required";
        } else if (value !== currentForm.password) {
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
      firstName: validateField("firstName", editForm.firstName, editForm),
      lastName: validateField("lastName", editForm.lastName, editForm),
      email: validateField("email", editForm.email, editForm),
      phone: validateField("phone", editForm.phone, editForm),
      password: validateField("password", editForm.password, editForm),
      confirmPassword: validateField("confirmPassword", editForm.confirmPassword, editForm),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    let fullPhone = selectedUser.phone || "";
    let matchedCode = "+91";
    let parsedPhone = fullPhone;
    
    for (const code of countryCodesList) {
      if (fullPhone.startsWith(code)) {
        matchedCode = code;
        parsedPhone = fullPhone.slice(code.length);
        break;
      }
    }

    setCountryCode(matchedCode);

    setEditForm({
      firstName: selectedUser.firstName || "",
      lastName: selectedUser.lastName || "",
      email: selectedUser.email || "",
      phone: parsedPhone,
      role: selectedUser.role || "customer",
      isActive: selectedUser.isActive,
      password: "",
      confirmPassword: "",
    });

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    setEditOpen(true);
    handleMenuClose();
  };

  const handleToggleStatus = async () => {
    const newStatus = !selectedUser.isActive;
    handleMenuClose();
    try {
      await axios.put(`/admin/users/${selectedUser._id}`, {
        isActive: newStatus,
      });
      toast.success(`User ${newStatus ? "activated" : "deactivated"} successfully`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    setLoadingAction(true);
    try {
      await axios.delete(`/admin/users/${selectedUser._id}`);
      toast.success("User deleted successfully");
      setDeleteOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const nextForm = {
        ...prev,
        [name]: value,
      };
      validateField(name, value, nextForm);
      if (name === "password" && nextForm.confirmPassword) {
        validateField("confirmPassword", nextForm.confirmPassword, nextForm);
      }
      return nextForm;
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    setEditForm((prev) => {
      const nextForm = {
        ...prev,
        phone: cleaned,
      };
      validateField("phone", cleaned, nextForm);
      return nextForm;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return toast.error("Please correct the errors in the form before submitting.");
    }

    setLoadingAction(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: `${countryCode}${editForm.phone}`,
        role: editForm.role,
        isActive: editForm.isActive,
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }

      await axios.put(`/admin/users/${selectedUser._id}`, payload);
      toast.success("User updated successfully");
      setEditOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-lg)",
          borderColor: "var(--color-border)",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}>
            <TableRow>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Joined</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : !users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
                return (
                  <TableRow
                    key={user._id}
                    hover
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      
                        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.2,
                              display: "block",
                            }}
                          >
                            {user.firstName || ""}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 500,
                              color: "text.secondary",
                              lineHeight: 1.2,
                              display: "block",
                            }}
                          >
                            {user.lastName || ""}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>{user.phone || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={formatRole(user.role)}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        color={user.isActive ? "success" : "error"}
                      />
                    </TableCell>

                    <TableCell>{formatJoinedDate(user.createdAt)}</TableCell>

                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {selectedUser?.role !== "customer" && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Edit User" />
          </MenuItem>
        )}

        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedUser?.isActive ? (
              <ToggleOffIcon fontSize="small" color="warning" />
            ) : (
              <ToggleOnIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={selectedUser?.isActive ? "Deactivate User" : "Activate User"}
          />
        </MenuItem>

        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete User" />
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => !loadingAction && setEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                  required
                  disabled={loadingAction}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                  required
                  disabled={loadingAction}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                  disabled={loadingAction}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handlePhoneChange}
                  required
                  disabled={loadingAction}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ gap: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
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
                            disabled={loadingAction}
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  disabled={loadingAction}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="shipping-manager">Shipping Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super-admin">Super Admin</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="isActive"
                  value={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isActive: e.target.value === "true" || e.target.value === true,
                    }))
                  }
                  disabled={loadingAction}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password (optional)"
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password || "Leave blank if you don't want to change password"}
                  disabled={loadingAction}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={handleEditChange}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  disabled={loadingAction}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setEditOpen(false)}
              variant="outlined"
              disabled={loadingAction}
              sx={{
                color: "var(--color-primary)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-lg)",
                textTransform: "none",
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
              disabled={loadingAction}
              sx={{
                bgcolor: "var(--color-primary)",
                color: "#fff",
                borderRadius: "var(--radius-lg)",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "var(--color-primary-dark)",
                },
              }}
            >
              {loadingAction ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => !loadingAction && setDeleteOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{" "}
            <b>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </b>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            disabled={loadingAction}
            sx={{
              color: "var(--color-primary)",
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-lg)",
              textTransform: "none",
              "&:hover": {
                borderColor: "var(--color-primary)",
                bgcolor: "var(--color-primary-subtle)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loadingAction}
            sx={{ borderRadius: "var(--radius-lg)", textTransform: "none" }}
          >
            {loadingAction ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;