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
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";

const Blogs = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    readTime: "5 min read",
    summary: "",
    content: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all blogs from database
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/blogs");
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB");
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
    setSelectedBlog(null);
    setFormData({
      title: "",
      category: "",
      author: "Planters Expert",
      readTime: "5 min read",
      summary: "",
      content: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setFormOpen(true);
  };

  const handleEditClick = (blog) => {
    setIsEditMode(true);
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || "",
      category: blog.category || "",
      author: blog.author || "Planters Expert",
      readTime: blog.readTime || "5 min read",
      summary: blog.summary || "",
      content: blog.content || "",
      isActive: blog.isActive !== undefined ? blog.isActive : true,
    });
    setImageFile(null);
    setImagePreview(blog.image || "");
    setFormOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const response = await axios.delete(`/blogs/${selectedBlog._id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Blog deleted successfully");
        setDeleteOpen(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast.error("Title, Category, Summary, and Content are required.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("category", formData.category.trim());
      data.append("author", formData.author.trim());
      data.append("readTime", formData.readTime.trim());
      data.append("summary", formData.summary.trim());
      data.append("content", formData.content.trim());
      data.append("isActive", formData.isActive);

      if (imageFile) {
        data.append("image", imageFile);
      } else if (!isEditMode && imagePreview) {
        data.append("image", imagePreview);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`/blogs/${selectedBlog._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || "Blog saved successfully");
        setFormOpen(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;
    return (
      blog.title?.toLowerCase().includes(search) ||
      blog.category?.toLowerCase().includes(search) ||
      blog.author?.toLowerCase().includes(search) ||
      blog.summary?.toLowerCase().includes(search)
    );
  });

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    dispatch(setSearchQueryRedux(e.target.value));
    setPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Blog Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Manage your store's blog posts, articles, and educational content
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
          sx={{ width: "100%" }}
        >
          <TextField
            placeholder="Search blogs by title, category, author or summary..."
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
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            height: 40,
            bgcolor: "var(--color-primary)",
            color: "#ffffff",
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
          Add Blog
        </Button>
      </Stack>

      {/* Loading state */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : filteredBlogs.length === 0 ? (
        <Paper
          sx={{
            py: 8,
            px: 2,
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--color-border)",
            boxShadow: "none",
            bgcolor: "transparent",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={1}>
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? "Try refining your search query." : "Get started by adding a new blog post."}
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Read Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Published Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBlogs.map((blog) => (
                  <TableRow
                    key={blog._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {blog.image ? (
                        <Box
                          component="img"
                          src={blog.image}
                          alt={blog.title}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "var(--radius-sm)",
                            objectFit: "cover",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "var(--radius-sm)",
                            bgcolor: "#f0f2f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.disabled",
                            fontSize: "0.75rem",
                            border: "1px dashed var(--color-border)",
                          }}
                        >
                          No Img
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={blog.title}>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: "#e8f5e9",
                          color: "var(--color-primary)",
                          border: "1px solid rgba(27, 122, 66, 0.2)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      />
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      <Chip
                        label={blog.readTime}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "#f1f3f5",
                          color: "#495057",
                          borderRadius: "var(--radius-sm)",
                        }}
                      />
                    </TableCell>
                    <TableCell>{blog.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={blog.isActive ? "Active" : "Inactive"}
                        color={blog.isActive ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Blog">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(blog)}
                            sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Blog">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(blog)}
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

      {/* Add / Edit Blog Dialog */}
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
        <DialogTitle sx={{ fontWeight: 700, pb: 1.5, borderBottom: "1px solid var(--color-border)" , color: "var(--color-primary)" }}>
          {isEditMode ? "✏️ Edit Blog Post" : "✨ Create New Blog Post"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              p: 3,
              pt: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--radius-lg)",
              },
            }}
          >
            <Grid container spacing={3}>
              {/* Cover Image Upload */}
              <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%", height: 180, mb: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Cover Preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "var(--radius-lg)",
                        objectFit: "cover",
                        border: "1px solid var(--color-border)",
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
                    sx={{
                      width: "100%",
                      height: 180,
                      borderRadius: "var(--radius-lg)",
                      borderStyle: "dashed",
                      borderColor: "var(--color-border)",
                      color: "var(--color-primary)",
                      "&:hover": {
                        borderColor: "var(--color-primary)",
                        bgcolor: "var(--color-primary-subtle)",
                      },
                      flexDirection: "column",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="body2">Upload Cover Image</Typography>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
                <Typography variant="caption" color="text.disabled" align="center">
                  Recommended size: 800x600 pixels. Max size 5MB.
                </Typography>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} sm={8}>
                <Stack spacing={2.5}>
                  <TextField
                    name="title"
                    label="Blog Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    size="small"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="category"
                        label="Category"
                        placeholder="e.g. PLANT CARE 101"
                        value={formData.category}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        size="small"
                        helperText="Use capital letters, e.g. MY PLANT DIARY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="readTime"
                        label="Read Time"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="author"
                    label="Author"
                    value={formData.author}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="summary"
                  label="Short Summary"
                  multiline
                  rows={2}
                  value={formData.summary}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="Brief summary to show on the blog listing card."
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Content (HTML Supported)
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setPreviewOpen(!previewOpen)}
                  >
                    {previewOpen ? "Hide Preview" : "Show Live Preview"}
                  </Button>
                </Stack>
                <TextField
                  name="content"
                  multiline
                  rows={10}
                  placeholder="<p class='mb-6'>Write your paragraph here...</p>"
                  value={formData.content}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Live Preview section */}
              {previewOpen && (
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: "var(--radius-lg)",
                      borderColor: "var(--color-border)",
                      bgcolor: "#fafafa",
                      maxHeight: 300,
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="subtitle2" color="primary.main" gutterBottom fontWeight="bold">
                      👀 HTML RENDERED PREVIEW
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <div
                      className="font-sans text-[15px] leading-[1.8] text-justify text-slate-800"
                      dangerouslySetInnerHTML={{ __html: formData.content || "<i>No content written yet.</i>" }}
                    />
                  </Paper>
                </Grid>
              )}

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
                  label="Published (Visible to customers)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa", borderTop: "1px solid var(--color-border)" }}>
            <Button
              onClick={() => setFormOpen(false)}
              disabled={submitting}
              variant="outlined"
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
              {submitting ? "Saving..." : "Save Blog"}
            </Button>
          </DialogActions>
        </form>
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
        <DialogTitle sx={{ fontWeight: 700 }}>⚠️ Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the blog post{" "}
            <strong>"{selectedBlog?.title}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={submitting}
            variant="outlined"
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
            disabled={submitting}
            variant="contained"
            color="error"
            sx={{
              px: 3,
              borderRadius: "var(--radius-lg)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Blogs;
