import { useState } from "react";
import {
  Avatar,
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
} from "@mui/material";

import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
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
    setEditForm({
      firstName: selectedUser.firstName || "",
      lastName: selectedUser.lastName || "",
      email: selectedUser.email || "",
      phone: selectedUser.phone || "",
      role: selectedUser.role || "customer",
      isActive: selectedUser.isActive,
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
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoadingAction(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
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
        elevation={2}
        sx={{ borderRadius: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
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
                      <Avatar
                        sx={{
                          mr: 2,
                          display: "inline-flex",
                          verticalAlign: "middle",
                          bgcolor: "primary.main",
                        }}
                      >
                        {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                      </Avatar>

                      <Typography
                        component="span"
                        sx={{
                          ml: 2,
                          fontWeight: 600,
                        }}
                      >
                        {fullName}
                      </Typography>
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
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Edit User" />
        </MenuItem>

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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  required
                  disabled={loadingAction}
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
                  helperText="Leave blank if you don't want to change password"
                  disabled={loadingAction}
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
                  disabled={loadingAction}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setEditOpen(false)}
              variant="outlined"
              disabled={loadingAction}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loadingAction}
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
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loadingAction}
          >
            {loadingAction ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;