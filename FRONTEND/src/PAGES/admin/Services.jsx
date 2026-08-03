import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery as setSearchQueryRedux } from "../../redux/search/searchSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";

const serviceTypeMapping = {
  "corporate-gifting": "Corporate Gifting",
  "plant-rental": "Plant Rental",
  "garden-maintenance": "Garden Maintenance",
  "vertical-garden": "Vertical Garden",
  "balcony-garden": "Balcony Garden",
};

const Services = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    serviceType: "",
    title: "",
    description: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/services");
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image file size should not exceed 3MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedService(null);
    setFormData({
      serviceType: "corporate-gifting",
      title: "",
      description: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setFormOpen(true);
  };

  const handleEditClick = (service) => {
    setIsEditMode(true);
    setSelectedService(service);
    setFormData({
      serviceType: service.serviceType || "corporate-gifting",
      title: service.title || "",
      description: service.description || "",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setImageFile(null);
    setImagePreview(service.image || "");
    setFormOpen(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const response = await axios.delete(`/services/${selectedService._id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Service deleted successfully");
        setDeleteOpen(false);
        fetchServices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceType || !formData.title.trim() || !formData.description.trim()) {
      toast.error("Service Type, Title and Description are required.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("serviceType", formData.serviceType);
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("isActive", formData.isActive);

      if (imageFile) {
        data.append("image", imageFile);
      } else if (!isEditMode && imagePreview) {
        data.append("image", imagePreview);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`/services/${selectedService._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("/services", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || "Service saved successfully");
        setFormOpen(false);
        fetchServices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    dispatch(setSearchQueryRedux(e.target.value));
    setPage(1);
  };

  // Filter services by search query
  const filteredServices = services.filter((service) => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;
    return (
      service.title?.toLowerCase().includes(search) ||
      service.description?.toLowerCase().includes(search) ||
      serviceTypeMapping[service.serviceType]?.toLowerCase().includes(search)
    );
  });

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
          Service Management
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }} variant="body2" color="text.secondary">
          Manage the dynamic services and articles displayed on the public footer service pages
        </Typography>
      </Box>

      {/* Search & Add Button */}
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
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            placeholder="Search services by title, description or type..."
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
              },
            }}
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "100%", md: 350 },
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: 2.5,
              },
            }}
          />
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            height: 40,
            bgcolor: "success.main",
            "&:hover": { bgcolor: "primary.main" },
            textTransform: "none",
            borderRadius: 2.5,
            px: 3,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 10px rgba(46, 125, 50, 0.15)",
          }}
        >
          Add Service
        </Button>
      </Stack>

      {/* Main Table */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : filteredServices.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed #e0e0e0",
            boxShadow: "none",
            bgcolor: "transparent",
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={1}>
            No services found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery ? "Try refining your search query." : "Get started by adding a new service listing."}
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              borderRadius: 3,
              mt: 2,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}>
                <TableRow>
                  <TableCell><b>Image</b></TableCell>
                  <TableCell><b>Service Page</b></TableCell>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell align="right"><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow
                    key={service._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {service.image ? (
                        <Box
                          component="img"
                          src={service.image}
                          alt={service.title}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            objectFit: "cover",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            bgcolor: "#f0f2f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.disabled",
                            fontSize: "0.75rem",
                            border: "1px dashed #cccccc",
                          }}
                        >
                          No Img
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={serviceTypeMapping[service.serviceType] || service.serviceType}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={service.title}>
                        {service.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" noWrap title={service.description} color="text.secondary">
                        {service.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.isActive ? "Active" : "Inactive"}
                        color={service.isActive ? "success" : "default"}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          px: 1,
                          bgcolor: service.isActive ? "success.main" : "grey.200",
                          color: service.isActive ? "#ffffff" : "text.secondary",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(service)}
                          sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(service)}
                          sx={{ bgcolor: "#ffebee", "&:hover": { bgcolor: "#ffcdd2" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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

      {/* Add / Edit Service Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#fdfdfd" }}>
          {isEditMode ? "✏️ Edit Service Listing" : "✨ Create New Service Listing"}
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Cover Image Upload */}
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%", height: 180, mb: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Cover Preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 3,
                        objectFit: "cover",
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleClearImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    color="success"
                    sx={{
                      width: "100%",
                      height: 180,
                      borderRadius: 3,
                      borderStyle: "dashed",
                      flexDirection: "column",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="body2">Upload Image</Typography>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
                <Typography variant="caption" color="text.disabled" align="center">
                  Recommended size: 800x600 pixels. Max size 3MB.
                </Typography>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} sm={8}>
                <Stack spacing={2.5}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="service-type-label">Service Category Page</InputLabel>
                    <Select
                      labelId="service-type-label"
                      name="serviceType"
                      value={formData.serviceType}
                      label="Service Category Page"
                      onChange={handleInputChange}
                    >
                      {Object.entries(serviceTypeMapping).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    name="title"
                    label="Service Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    size="small"
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description / Offering Content"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
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
                  label="Active (Visible on public pages)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, bgcolor: "#fdfdfd" }}>
            <Button
              onClick={() => setFormOpen(false)}
              color="inherit"
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {submitting ? "Saving..." : "Save Service"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => !submitting && setDeleteOpen(false)}
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>⚠️ Delete Service Listing</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the service{" "}
            <strong>"{selectedService?.title}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            color="inherit"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
