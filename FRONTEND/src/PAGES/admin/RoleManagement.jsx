import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Security, Add, Edit, Delete, Lock, VerifiedUser } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const PERMISSION_KEYS = [
  { key: "userManagement", label: "User Management" },
  { key: "roleManagement", label: "Role & Permission Management" },
  { key: "systemGovernance", label: "System Governance & Payment Keys" },
  { key: "catalogManagement", label: "Catalog & Products Management" },
  { key: "inventoryControl", label: "Inventory Control" },
  { key: "orderLifecycle", label: "Order Lifecycle & Processing" },
  { key: "fulfillmentShipping", label: "Fulfillment & Shipping Logistics" },
  { key: "marketingSales", label: "Marketing, Coupons & Banners" },
  { key: "reportsDashboard", label: "Analytics & Reports" },
  { key: "crmSupport", label: "CRM & Live Support" },
];

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissionsState, setPermissionsState] = useState(
    PERMISSION_KEYS.reduce((acc, p) => ({ ...acc, [p.key]: "DENY" }), {})
  );

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/roles");
      if (data.success) {
        const filteredRoles = data.roles.filter(
          (role) => role.code !== "super-admin" && role.code !== "customer"
        );
        setRoles(filteredRoles);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch role configurations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateDialog = () => {
    setIsEditing(false);
    setEditingRoleId(null);
    setRoleName("");
    setRoleCode("");
    setRoleDescription("");
    setPermissionsState(
      PERMISSION_KEYS.reduce((acc, p) => ({ ...acc, [p.key]: "DENY" }), {})
    );
    setDialogOpen(true);
  };

  const openEditDialog = (role) => {
    setIsEditing(true);
    setEditingRoleId(role._id);
    setRoleName(role.name);
    setRoleCode(role.code);
    setRoleDescription(role.description || "");
    setPermissionsState({
      ...PERMISSION_KEYS.reduce((acc, p) => ({ ...acc, [p.key]: "DENY" }), {}),
      ...(role.permissions || {}),
    });
    setDialogOpen(true);
  };

  const handlePermissionToggle = (key) => {
    setPermissionsState((prev) => ({
      ...prev,
      [key]: prev[key] === "ALLOW" ? "DENY" : "ALLOW",
    }));
  };

  const handleSaveRole = async () => {
    if (!roleName || (!isEditing && !roleCode)) {
      toast.error("Role Name and Code are required.");
      return;
    }

    try {
      if (isEditing) {
        const { data } = await axiosInstance.put(`/roles/${editingRoleId}`, {
          name: roleName,
          description: roleDescription,
          permissions: permissionsState,
        });
        if (data.success) {
          toast.success(data.message);
          setDialogOpen(false);
          fetchRoles();
        }
      } else {
        const { data } = await axiosInstance.post("/roles", {
          name: roleName,
          code: roleCode,
          description: roleDescription,
          permissions: permissionsState,
        });
        if (data.success) {
          toast.success(data.message);
          setDialogOpen(false);
          fetchRoles();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save role.");
    }
  };

  const handleDeleteRole = async (role) => {
    if (role.isSystemRole) {
      toast.error("System roles cannot be deleted.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete custom role '${role.name}'?`)) {
      return;
    }

    try {
      const { data } = await axiosInstance.delete(`/roles/${role._id}`);
      if (data.success) {
        toast.success(data.message);
        fetchRoles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete role.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            🛡️ Role-Based Access Control (RBAC) & Governance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure dynamic internal roles, permissions matrices, and system authority levels.
          </Typography>
        </Box>
        <Button variant="contained" color="success" startIcon={<Add />} onClick={openCreateDialog}>
          Create Custom Role
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} md={6} key={role._id}>
              <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {role.name}
                        </Typography>
                        {role.isSystemRole ? (
                          <Chip label="System Role" size="small" color="primary" icon={<Lock fontSize="small" />} />
                        ) : (
                          <Chip label="Custom Role" size="small" color="secondary" icon={<VerifiedUser fontSize="small" />} />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                        code: {role.code}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit Permissions">
                        <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => openEditDialog(role)}>
                          Edit
                        </Button>
                      </Tooltip>
                      {!role.isSystemRole && (
                        <Tooltip title="Delete Role">
                          <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteRole(role)}>
                            Delete
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {role.description || "No description provided."}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Granted Module Access:
                  </Typography>
                  <Grid container spacing={1}>
                    {PERMISSION_KEYS.map((perm) => {
                      const isAllowed = role.permissions?.[perm.key] === "ALLOW";
                      return (
                        <Grid item xs={6} key={perm.key}>
                          <Chip
                            label={perm.label}
                            size="small"
                            color={isAllowed ? "success" : "default"}
                            variant={isAllowed ? "filled" : "outlined"}
                            sx={{ width: "100%", justifyContent: "flex-start", fontSize: "0.75rem" }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Role Edit/Create Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {isEditing ? `✏️ Edit Role: ${roleName}` : "➕ Create Custom Role"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role Display Name"
                placeholder="e.g. Warehouse Officer"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                disabled={isEditing}
                label="Role Unique Code"
                placeholder="e.g. warehouse-officer"
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Role Description"
                placeholder="Describe responsibilities and access limits..."
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mt: 2, mb: 1 }}>
                🔐 Permission Matrix Controls:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
                <Grid container spacing={2}>
                  {PERMISSION_KEYS.map((perm) => {
                    const allowed = permissionsState[perm.key] === "ALLOW";
                    return (
                      <Grid item xs={12} sm={6} key={perm.key}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={allowed}
                              onChange={() => handlePermissionToggle(perm.key)}
                              color="success"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={allowed ? "bold" : "normal"}>
                                {perm.label}
                              </Typography>
                              <Typography variant="caption" color={allowed ? "success.main" : "text.secondary"}>
                                {allowed ? "ENABLED (ALLOW)" : "DISABLED (DENY)"}
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSaveRole}>
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
