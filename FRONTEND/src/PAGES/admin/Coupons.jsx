import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery as setSearchQueryRedux } from "../../redux/search/searchSlice";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";

const Coupons = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    usagePerUser: 1,
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  // Fetch all coupons with filters and pagination
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (discountTypeFilter !== "all") {
        params.type = discountTypeFilter;
      }

      const { data } = await axios.get("/coupons", { params });
      if (data.success) {
        setCoupons(data.coupons || []);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  useEffect(() => {
    fetchCoupons();
  }, [page, searchQuery, discountTypeFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split("T")[0];

    setFormData({
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "0",
      maximumDiscountAmount: "0",
      usageLimit: "0",
      usagePerUser: 1,
      validFrom: today,
      validUntil: nextMonthStr,
      isActive: true,
    });
    setFormOpen(true);
  };

  const handleEditClick = (coupon) => {
    setIsEditMode(true);
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code || "",
      name: coupon.name || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || "",
      minimumOrderAmount: coupon.minimumOrderAmount || 0,
      maximumDiscountAmount: coupon.maximumDiscountAmount || 0,
      usageLimit: coupon.usageLimit || 0,
      usagePerUser: coupon.usagePerUser || 1,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split("T")[0] : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : "",
      isActive: coupon.isActive !== false,
    });
    setFormOpen(true);
  };

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteOpen(true);
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.discountValue) {
      toast.error("Code, Name, and Discount Value are required.");
      return;
    }

    if (formData.discountType === "percentage" && Number(formData.discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      toast.error("Expiration date must be after start date.");
      return;
    }

    try {
      setSubmitting(true);
      const submissionData = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: Number(formData.minimumOrderAmount || 0),
        maximumDiscountAmount: Number(formData.maximumDiscountAmount || 0),
        usageLimit: Number(formData.usageLimit || 0),
        usagePerUser: Number(formData.usagePerUser || 1),
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        isActive: formData.isActive,
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`/coupons/${selectedCoupon._id}`, submissionData);
      } else {
        response = await axios.post("/coupons", submissionData);
      }

      if (response.data.success) {
        toast.success(response.data.message || "Coupon saved successfully");
        setFormOpen(false);
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Coupon
  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.delete(`/coupons/${selectedCoupon._id}`);
      if (data.success) {
        toast.success("Coupon deleted successfully");
        setDeleteOpen(false);
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
          Promotional Coupons
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }} variant="body2" color="text.secondary">
          Create, monitor, and manage discount campaign codes for your customer base
        </Typography>
      </Box>

      {/* Search, Filters & Add Button */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-end", md: "center" }}
        mb={4}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ width: "100%" }}
        >
          <TextField
            placeholder="Search coupons by Code or Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              dispatch(setSearchQueryRedux(e.target.value));
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
              },
            }}
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "100%", sm: 350, md: 450 },
              flexShrink: 0,
              bgcolor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "var(--radius-lg)",
                "& fieldset": {
                  borderColor: "var(--color-border)",
                },
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel id="discount-filter-label">Filter by Type</InputLabel>
            <Select
              labelId="discount-filter-label"
              value={discountTypeFilter}
              label="Filter by Type"
              onChange={(e) => {
                setDiscountTypeFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                height: 40,
                borderRadius: "var(--radius-lg)",
                borderColor: "var(--color-border)",
                "& .MuiSelect-select": {
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  py: 0,
                },
              }}
            >
              <MenuItem value="all">All Discount Types</MenuItem>
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            height: 40,
            bgcolor: "var(--color-primary)",
            color: "#fff",
            borderRadius: "var(--radius-lg)",
            textTransform: "none",
            px: 3,
            whiteSpace: "nowrap",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "var(--color-primary-dark)",
              boxShadow: "none",
            },
          }}
        >
          Add Coupon
        </Button>
      </Stack>

      {/* Main Table */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : coupons.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--color-border)",
            boxShadow: "none",
            bgcolor: "transparent",
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={1}>
            No coupons found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery || discountTypeFilter !== "all" 
              ? "Try adjusting your filters or search term." 
              : "Get started by adding a promotional coupon code."}
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: "var(--radius-lg)",
              borderColor: "var(--color-border)",
              mt: 2,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Coupon Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Coupon Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Discount Details</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Minimum Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Limit / Used</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Date Range</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Chip
                        label={coupon.code}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          bgcolor: "#e8f5e9",
                          color: "var(--color-primary)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid rgba(27, 122, 66, 0.2)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {coupon.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {coupon.discountType === "percentage" 
                          ? `${coupon.discountValue}% Off` 
                          : `₹${coupon.discountValue} Off`}
                      </Typography>
                      {coupon.discountType === "percentage" && coupon.maximumDiscountAmount > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Max Cap: ₹{coupon.maximumDiscountAmount}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {coupon.minimumOrderAmount > 0 ? `₹${coupon.minimumOrderAmount}` : "No minimum"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {coupon.usedCount} used
                      </Typography>
                      {coupon.usageLimit > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Limit: {coupon.usageLimit}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(coupon.validFrom).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        to {new Date(coupon.validUntil).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={coupon.isActive ? "Active" : "Inactive"}
                        color={coupon.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Coupon">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(coupon)}
                            sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Coupon">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(coupon)}
                            sx={{ bgcolor: "#ffebee", "&:hover": { bgcolor: "#ffcdd2" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box mt={3}>
              <UserPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </Box>
          )}
        </>
      )}

      {/* Add / Edit Coupon Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "var(--radius-lg)",
              boxShadow: "none",
              border: "1px solid var(--color-border)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 2, pb: 1 }}>
          {isEditMode ? "Edit Coupon Details" : "Add New Coupon"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              px: 3,
              py: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--radius-lg)",
              },
            }}
          >
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  value={formData.code}
                  onChange={handleInputChange}
                  name="code"
                  required
                  disabled={submitting}
                  placeholder="e.g. WELCOME10"
                  helperText="Unique code customers enter at checkout"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Coupon Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                  required
                  disabled={submitting}
                  placeholder="e.g. Welcome Discount"
                  helperText="User-friendly name descriptive of the discount"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Campaign Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  disabled={submitting}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required disabled={submitting}>
                  <InputLabel id="discount-type-label">Discount Type</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    value={formData.discountType}
                    label="Discount Type"
                    onChange={handleInputChange}
                    name="discountType"
                  >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={formData.discountType === "percentage" ? "Discount Percentage (%)" : "Fixed Discount Value ($)"}
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  name="discountValue"
                  required
                  disabled={submitting}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: formData.discountType === "percentage" ? 100 : undefined,
                      step: "0.01",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Order Subtotal ($)"
                  value={formData.minimumOrderAmount}
                  onChange={handleInputChange}
                  name="minimumOrderAmount"
                  disabled={submitting}
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Cap Discount ($)"
                  value={formData.maximumDiscountAmount}
                  onChange={handleInputChange}
                  name="maximumDiscountAmount"
                  disabled={submitting}
                  helperText="Only applicable for Percentage type"
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Usage Limit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  name="usageLimit"
                  disabled={submitting}
                  helperText="0 for unlimited total uses"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Usage Limit Per User"
                  value={formData.usagePerUser}
                  onChange={handleInputChange}
                  name="usagePerUser"
                  required
                  disabled={submitting}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Valid From"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  name="validFrom"
                  required
                  disabled={submitting}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Valid Until"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  name="validUntil"
                  required
                  disabled={submitting}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="success"
                    />
                  }
                  label="Coupon Status (Active / Inactive)"
                  disabled={submitting}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa", borderTop: "1px solid var(--color-border)" }}>
            <Button
              onClick={() => setFormOpen(false)}
              variant="outlined"
              disabled={submitting}
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
              disabled={submitting}
              sx={{
                bgcolor: "var(--color-primary)",
                color: "#fff",
                borderRadius: "var(--radius-lg)",
                textTransform: "none",
                px: 3,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "var(--color-primary-dark)",
                  boxShadow: "none",
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Coupon"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => !submitting && setDeleteOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "var(--radius-lg)",
              boxShadow: "none",
              border: "1px solid var(--color-border)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Promo Coupon</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete coupon code <strong>{selectedCoupon?.code}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
            This will soft-delete the coupon and prevent further user applications.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            disabled={submitting}
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
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={submitting}
            sx={{
              px: 3,
              borderRadius: "var(--radius-lg)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Coupons;
