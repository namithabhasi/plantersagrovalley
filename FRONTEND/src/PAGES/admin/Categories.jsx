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

const Categories = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "none",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/categories");
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);

  // Handle auto-slugification from category name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditMode ? prev.slug : slug, // Only auto-fill slug on creation, not edit
    }));
  };

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
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentCategory: "none",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setFormOpen(true);
  };

  const handleEditClick = (category) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      parentCategory: category.parentCategory?._id || category.parentCategory || "none",
      isActive: category.isActive,
    });
    setImageFile(null);
    setImagePreview(category.image || "");
    setFormOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and Slug are required.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("slug", formData.slug.trim());
      data.append("description", formData.description.trim());
      data.append("parentCategory", formData.parentCategory === "none" ? "" : formData.parentCategory);
      data.append("isActive", formData.isActive);

      if (imageFile) {
        data.append("image", imageFile);
      } else if (!isEditMode && imagePreview) {
        // If image URL is manually provided or persisted (not common)
        data.append("image", imagePreview);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`/categories/${selectedCategory._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("/categories", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || "Category saved successfully");
        setFormOpen(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.delete(`/categories/${selectedCategory._id}`);
      if (data.success) {
        toast.success("Category deleted successfully");
        setDeleteOpen(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter categories by search query
  const filteredCategories = categories.filter((category) => {
    const name = category.name?.toLowerCase() || "";
    const description = category.description?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  // Exclude current category and its descendants (to prevent circular hierarchies)
  // For simplicity, we just filter out the current category from the parent options.
  const parentCategoryOptions = categories.filter(
    (cat) => !isEditMode || cat._id !== selectedCategory?._id
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#1b5e20", mb: 0.5 }}>
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your store's product categories and catalog structure
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            bgcolor: "#2e7d32",
            "&:hover": { bgcolor: "#1b5e20" },
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1.2,
            boxShadow: "0 4px 10px rgba(46, 125, 50, 0.15)",
          }}
        >
          Add Category
        </Button>
      </Stack>

      {/* Search & Filters */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <TextField
            fullWidth
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              dispatch(setSearchQueryRedux(e.target.value));
            }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
              },
            }}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Main Table */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : filteredCategories.length === 0 ? (
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
            No categories found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery ? "Try refining your search query." : "Get started by adding a new product category."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Parent Category</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow
                  key={category._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {category.image ? (
                      <Box
                        component="img"
                        src={category.image}
                        alt={category.name}
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
                  <TableCell sx={{ fontWeight: 600 }}>{category.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.slug}
                      size="small"
                      sx={{
                        fontFamily: "monospace",
                        bgcolor: "#f1f3f5",
                        color: "#495057",
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, color: "text.secondary" }}>
                    <Typography variant="body2" noWrap title={category.description}>
                      {category.description || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {category.parentCategory?.name ? (
                      <Chip
                        label={category.parentCategory.name}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? "Active" : "Inactive"}
                      color={category.isActive ? "success" : "default"}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        px: 1,
                        bgcolor: category.isActive ? "#e8f5e9" : "#f1f3f5",
                        color: category.isActive ? "#2e7d32" : "#5f6368",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(category)}
                        sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(category)}
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
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 2, pb: 1 }}>
          {isEditMode ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={handleNameChange}
                required
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={handleInputChange}
                name="slug"
                required
                disabled={submitting}
                helperText="URL-friendly identifier (e.g. fresh-fruits)"
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                name="description"
                multiline
                rows={3}
                disabled={submitting}
              />
              <FormControl fullWidth disabled={submitting}>
                <InputLabel id="parent-category-label">Parent Category</InputLabel>
                <Select
                  labelId="parent-category-label"
                  value={formData.parentCategory}
                  label="Parent Category"
                  onChange={handleInputChange}
                  name="parentCategory"
                >
                  <MenuItem value="none">
                    <em>None (Primary Category)</em>
                  </MenuItem>
                  {parentCategoryOptions.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isEditMode && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="success"
                    />
                  }
                  label="Category Status (Active / Inactive)"
                  disabled={submitting}
                />
              )}

              {/* Image upload section */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ fontWeight: 600 }}>
                  Category Image
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  {imagePreview ? (
                    <Box sx={{ position: "relative", width: 80, height: 80 }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 2,
                          objectFit: "cover",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleClearImage}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "#ef5350",
                          color: "white",
                          p: 0.2,
                          "&:hover": { bgcolor: "#d32f2f" },
                        }}
                        disabled={submitting}
                      >
                        <ClearIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      disabled={submitting}
                      sx={{
                        height: 80,
                        width: 140,
                        borderStyle: "dashed",
                        borderColor: "rgba(0, 0, 0, 0.23)",
                        color: "text.secondary",
                        textTransform: "none",
                        borderRadius: 2,
                        flexDirection: "column",
                        gap: 0.5,
                        "& .MuiButton-icon": { m: 0 },
                      }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Supports JPG, PNG, WEBP.
                    <br />
                    Max size: 3MB.
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setFormOpen(false)}
              disabled={submitting}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={submitting}
              sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : isEditMode ? "Save Changes" : "Create"}
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
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the category{" "}
            <strong>{selectedCategory?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
            This will soft-delete the category and make it inactive.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={submitting}
            sx={{ px: 3, borderRadius: 2 }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
