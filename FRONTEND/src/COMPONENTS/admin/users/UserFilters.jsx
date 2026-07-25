import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

const UserFilters = ({
  role,
  setRole,
  status,
  setStatus,
  hideRoleFilter,
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ width: "100%" }}
    >
      {/* Role Filter */}
      {!hideRoleFilter && (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Role</InputLabel>

          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="super-admin">Super Admin</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="shipping-manager">
              Shipping Manager
            </MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>

        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default UserFilters;