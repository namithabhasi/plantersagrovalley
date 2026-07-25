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
  Pagination,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";

const Products = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    category: "",
    price: "",
    salePrice: "",
    stock: "",
    brand: "",
    tags: "",
    isFeatured: false,
    isActive: true,
  });
  
  // Image Upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all products with filters and pagination
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
      };

      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      if (selectedCategoryFilter !== "all") {
        params.category = selectedCategoryFilter;
      }

      const { data } = await axios.get("/products", { params });
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active categories for dropdown
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      if (data.success) {
        // Filter out deleted categories, keeping only active ones for new assignments
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery, selectedCategoryFilter]);

  // Handle auto-slugification from product name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditMode ? prev.slug : slug,
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

  // File Upload Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    if (imageFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemovePreview = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      slug: "",
      sku: "",
      description: "",
      shortDescription: "",
      category: "",
      price: "",
      salePrice: "",
      stock: "",
      brand: "",
      tags: "",
      isFeatured: false,
      isActive: true,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setFormOpen(true);
  };

  const handleEditClick = (product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      sku: product.sku || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      category: product.category?._id || product.category || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      stock: product.stock || 0,
      brand: product.brand || "",
      tags: product.tags ? product.tags.join(", ") : "",
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(product.images || []);
    setFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  // Submit Product Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.sku.trim() || !formData.category) {
      toast.error("Name, SKU, and Category are required.");
      return;
    }

    if (formData.salePrice && Number(formData.salePrice) > Number(formData.price)) {
      toast.error("Sale price cannot be greater than the regular price.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      
      data.append("name", formData.name.trim());
      data.append("slug", formData.slug.trim());
      data.append("sku", formData.sku.trim().toUpperCase());
      data.append("description", formData.description.trim());
      data.append("shortDescription", formData.shortDescription.trim());
      data.append("category", formData.category);
      data.append("price", formData.price);
      if (formData.salePrice) {
        data.append("salePrice", formData.salePrice);
      } else {
        data.append("salePrice", 0);
      }
      data.append("stock", formData.stock);
      data.append("brand", formData.brand.trim());
      data.append("tags", formData.tags);
      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);

      // Append new files
      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      let response;
      if (isEditMode) {
        response = await axios.put(`/products/${selectedProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || "Product saved successfully");
        setFormOpen(false);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product Confirmation
  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.delete(`/products/${selectedProduct._id}`);
      if (data.success) {
        toast.success("Product deleted successfully");
        setDeleteOpen(false);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

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
            Product Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, update, and search items in your inventory catalog
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
          Add Product
        </Button>
      </Stack>

      {/* Filters Card */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search products by name, brand, SKU or tags..."
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={selectedCategoryFilter}
                  label="Filter by Category"
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  sx={{ borderRadius: 2.5 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Table */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : products.length === 0 ? (
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
            No products found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery || selectedCategoryFilter !== "all" 
              ? "Try adjusting your filters or search term." 
              : "Get started by adding your first catalog product."}
          </Typography>
        </Paper>
      ) : (
        <>
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Product details</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Featured</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <Box
                          component="img"
                          src={product.images[0].url}
                          alt={product.name}
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
                      <Typography variant="body1" fontWeight={600}>
                        {product.name}
                      </Typography>
                      {product.brand && (
                        <Typography variant="caption" color="text.secondary">
                          Brand: {product.brand}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.sku}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "#f1f3f5",
                          color: "#495057",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.category?.name ? (
                        <Chip
                          label={product.category.name}
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
                      {product.salePrice > 0 ? (
                        <Stack spacing={0.2}>
                          <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                            ${product.price}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="error.main">
                            ${product.salePrice}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" fontWeight={600}>
                          ${product.price}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={product.stock > 10 ? "text.primary" : product.stock > 0 ? "warning.main" : "error.main"}
                      >
                        {product.stock} units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {product.isFeatured ? (
                        <Tooltip title="Featured Product">
                          <IconButton size="small" color="warning">
                            <StarIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Not Featured">
                          <IconButton size="small" color="default" disabled>
                            <StarBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive !== false ? "Active" : "Inactive"}
                        color={product.isActive !== false ? "success" : "default"}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          px: 1,
                          bgcolor: product.isActive !== false ? "#e8f5e9" : "#f1f3f5",
                          color: product.isActive !== false ? "#2e7d32" : "#5f6368",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(product)}
                          sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(product)}
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
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="success"
            />
          </Stack>
        </>
      )}

      {/* Add / Edit Product Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 2, pb: 1 }}>
          {isEditMode ? "Edit Product Details" : "Add New Product"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  name="slug"
                  required
                  disabled={submitting}
                  helperText="URL identifier (e.g. delicious-apple)"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SKU Code"
                  value={formData.sku}
                  onChange={handleInputChange}
                  name="sku"
                  required
                  disabled={submitting}
                  helperText="Unique Inventory ID"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required disabled={submitting}>
                  <InputLabel id="product-category-label">Category</InputLabel>
                  <Select
                    labelId="product-category-label"
                    value={formData.category}
                    label="Category"
                    onChange={handleInputChange}
                    name="category"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Brand Name"
                  value={formData.brand}
                  onChange={handleInputChange}
                  name="brand"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Regular Price ($)"
                  value={formData.price}
                  onChange={handleInputChange}
                  name="price"
                  required
                  disabled={submitting}
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discount/Sale Price ($)"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  name="salePrice"
                  disabled={submitting}
                  helperText="Optional"
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock Inventory"
                  value={formData.stock}
                  onChange={handleInputChange}
                  name="stock"
                  required
                  disabled={submitting}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (Comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                  name="tags"
                  disabled={submitting}
                  helperText="e.g. fertilizer, green, organic"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  name="shortDescription"
                  disabled={submitting}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  required
                  disabled={submitting}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="success"
                    />
                  }
                  label="Product Status (Active / Inactive)"
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleSwitchChange}
                      name="isFeatured"
                      color="warning"
                    />
                  }
                  label="Feature Product on Home Page"
                  disabled={submitting}
                />
              </Grid>

              {/* Image Previews / Upload section */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ fontWeight: 600 }}>
                  Product Images (Maximum 5)
                </Typography>
                
                {/* Existing Images (Edit mode only) */}
                {isEditMode && existingImages.length > 0 && imagePreviews.length === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Existing Images (will be replaced if new images are uploaded):
                    </Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      {existingImages.map((img, idx) => (
                        <Box
                          key={img.public_id || idx}
                          component="img"
                          src={img.url}
                          alt="product"
                          sx={{
                            width: 65,
                            height: 65,
                            borderRadius: 2,
                            objectFit: "cover",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Uploaded / New Image Previews */}
                <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} sx={{ position: "relative", width: 85, height: 85 }}>
                      <Box
                        component="img"
                        src={preview}
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
                        onClick={() => handleRemovePreview(index)}
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
                  ))}

                  {imagePreviews.length < 5 && (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      disabled={submitting}
                      sx={{
                        height: 85,
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
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )}
                  
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Supports JPG, JPEG, PNG, WEBP.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Max size: 5MB per file.
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
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
              {submitting ? <CircularProgress size={20} color="inherit" /> : isEditMode ? "Save Changes" : "Create Product"}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Catalog Product</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the product{" "}
            <strong>{selectedProduct?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
            This will soft-delete the product, removing it from active catalogs.
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

export default Products;
