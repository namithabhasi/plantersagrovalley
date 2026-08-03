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
        <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
          Blog Management
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }} variant="body2" color="text.secondary">
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
          sx={{ width: { xs: "100%", md: "auto" } }}
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
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed #e0e0e0",
            boxShadow: "none",
            bgcolor: "transparent",
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={1}>
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery ? "Try refining your search query." : "Get started by adding a new blog post."}
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
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Author</b></TableCell>
                  <TableCell><b>Read Time</b></TableCell>
                  <TableCell><b>Published Date</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell align="right"><b>Actions</b></TableCell>
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
                    <TableCell sx={{ fontWeight: 600, maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={blog.title}>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={blog.category}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
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
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>{blog.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={blog.isActive ? "Active" : "Inactive"}
                        color={blog.isActive ? "success" : "default"}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          px: 1,
                          bgcolor: blog.isActive ? "success.main" : "grey.200",
                          color: blog.isActive ? "#ffffff" : "text.secondary",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(blog)}
                          sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(blog)}
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

      {/* Add / Edit Blog Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#fdfdfd" }}>
          {isEditMode ? "✏️ Edit Blog Post" : "✨ Create New Blog Post"}
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
                      borderRadius: 3,
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
              {submitting ? "Saving..." : "Save Blog"}
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
        <DialogTitle sx={{ fontWeight: "bold" }}>⚠️ Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the blog post{" "}
            <strong>"{selectedBlog?.title}"</strong>? This action cannot be undone.
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

export default Blogs;
