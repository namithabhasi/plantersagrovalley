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
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Reply as ReplyIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";
const EnquiryStatusColors = {
  unread: { bg: "#ffebee", color: "#b71c1c" },
  read: { bg: "#fff3e0", color: "#e65100" },
  replied: { bg: "#e8f5e9", color: "#2e7d32" },
};

const Enquiries = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Reply states
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: "Planters Agro Valley - Response to Enquiry",
    message: ""
  });
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/enquiries");
      if (data.success) {
        setEnquiries(data.enquiries || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  // Handle status update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(`/enquiries/${id}/status`, { status: newStatus });
      if (data.success) {
        toast.success(data.message || "Enquiry status updated");
        // Update local state directly to prevent full reload
        setEnquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Open detail dialog and automatically mark as Read if status is Unread
  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailOpen(true);
    if (enquiry.status === "unread") {
      handleUpdateStatus(enquiry._id, "read");
    }
  };

  const handleOpenDelete = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEnquiry) return;
    try {
      const { data } = await axios.delete(`/enquiries/${selectedEnquiry._id}`);
      if (data.success) {
        toast.success(data.message || "Enquiry deleted successfully");
        setEnquiries((prev) => prev.filter((item) => item._id !== selectedEnquiry._id));
        setDeleteOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete enquiry");
    }
  };

  const handleOpenReply = () => {
    setReplyData({
      subject: `Planters Agro Valley - Response to Enquiry`,
      message: `Hello ${selectedEnquiry.name},\n\nThank you for reaching out to Planters Agro Valley. Regarding your enquiry:\n"${selectedEnquiry.comment}"\n\n[Type your response here]\n\nBest regards,\nPlanters Agro Valley Team`
    });
    setReplyOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyData.message.trim()) {
      toast.error("Message is required");
      return;
    }
    try {
      setSendingReply(true);
      const { data } = await axios.post(`/enquiries/${selectedEnquiry._id}/reply`, replyData);
      if (data.success) {
        toast.success(data.message || "Email response sent successfully");
        setReplyOpen(false);
        setDetailOpen(false);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === selectedEnquiry._id ? { ...item, status: "replied" } : item))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email response");
    } finally {
      setSendingReply(false);
    }
  };

  // Filter & Search logic
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.phone.includes(searchQuery) ||
      enquiry.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Contact Enquiries
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }} >
            View and manage message submissions from customers on the Contact page
          </Typography>
        </Box>
      </Stack>

      {/* Search & Filters */}
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
          {/* Search Input */}
          <TextField
            placeholder="Search by name, email, phone or comment..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      dispatch(setSearchQueryRedux(""));
                      setPage(1);
                    }}
                  >
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                ),
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

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
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
              <MenuItem value="all">All Enquiries</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="success" />
        </Box>
      ) : paginatedEnquiries.length === 0 ? (
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
          <EmailIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            No enquiries found
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Enquiries from the contact form will show up here.
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Contact Details</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Message Preview</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEnquiries.map((enquiry) => (
                  <TableRow
                    key={enquiry._id}
                    hover
                    sx={{
                      bgcolor: enquiry.status === "unread" ? "action.hover" : "inherit",
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {formatDate(enquiry.createdAt)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: enquiry.status === "unread" ? 600 : 400 }}>
                      {enquiry.name}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        {enquiry.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                        {enquiry.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: "0.85rem",
                          color: enquiry.status === "unread" ? "text.primary" : "text.secondary",
                          fontWeight: enquiry.status === "unread" ? 500 : 400,
                        }}
                      >
                        {enquiry.comment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={enquiry.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: EnquiryStatusColors[enquiry.status]?.bg || "#f1f3f5",
                          color: EnquiryStatusColors[enquiry.status]?.color || "#495057",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Message">
                          <IconButton
                            color="info"
                            onClick={() => handleOpenDetail(enquiry)}
                            size="small"
                            sx={{ bgcolor: "#e0f7fa", "&:hover": { bgcolor: "#b2ebf2" } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {enquiry.status !== "replied" && (
                          <Tooltip title="Mark as Replied">
                            <IconButton
                              color="success"
                              onClick={() => handleUpdateStatus(enquiry._id, "replied")}
                              size="small"
                              sx={{ bgcolor: "#e8f5e9", "&:hover": { bgcolor: "#c8e6c9" } }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {enquiry.status === "replied" && (
                          <Tooltip title="Mark as Read (Reset status)">
                            <IconButton
                              color="warning"
                              onClick={() => handleUpdateStatus(enquiry._id, "read")}
                              size="small"
                              sx={{ bgcolor: "#fff3e0", "&:hover": { bgcolor: "#ffe0b2" } }}
                            >
                              <MarkEmailReadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete Message">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDelete(enquiry)}
                            size="small"
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

          <UserPagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}

      {/* Enquiry Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
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
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid var(--color-border)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Enquiry Details
            </Typography>
            {selectedEnquiry && (
              <Chip
                label={selectedEnquiry.status.toUpperCase()}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: EnquiryStatusColors[selectedEnquiry.status]?.bg || "#f1f3f5",
                  color: EnquiryStatusColors[selectedEnquiry.status]?.color || "#495057",
                }}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedEnquiry && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                  SENDER
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedEnquiry.name}
                </Typography>
              </Box>

              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                    EMAIL ADDRESS
                  </Typography>
                  <Typography variant="body2">{selectedEnquiry.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                    PHONE NUMBER
                  </Typography>
                  <Typography variant="body2">{selectedEnquiry.phone}</Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                  SUBMISSION DATE & TIME
                </Typography>
                <Typography variant="body2">{formatDate(selectedEnquiry.createdAt)}</Typography>
              </Box>

              <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 1 }}>
                  MESSAGE
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "text.primary" }}>
                  {selectedEnquiry.comment}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa", borderTop: "1px solid var(--color-border)" }}>
          {selectedEnquiry && selectedEnquiry.status !== "replied" && (
            <Button
              variant="contained"
              startIcon={<ReplyIcon />}
              onClick={handleOpenReply}
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
              Reply via Email
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => setDetailOpen(false)}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyOpen}
        onClose={() => !sendingReply && setReplyOpen(false)}
        maxWidth="sm"
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
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid var(--color-border)" }}>
          <Typography variant="h6" fontWeight={700}>
            Reply to Enquiry
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "var(--radius-lg)",
            },
          }}
        >
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Subject"
              size="small"
              value={replyData.subject}
              onChange={(e) => setReplyData((prev) => ({ ...prev, subject: e.target.value }))}
              disabled={sendingReply}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={10}
              value={replyData.message}
              onChange={(e) => setReplyData((prev) => ({ ...prev, message: e.target.value }))}
              disabled={sendingReply}
              placeholder="Type your response email..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa", borderTop: "1px solid var(--color-border)" }}>
          <Button
            variant="outlined"
            onClick={() => setReplyOpen(false)}
            disabled={sendingReply}
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
            variant="contained"
            startIcon={<ReplyIcon />}
            onClick={handleSendReply}
            disabled={sendingReply}
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
            {sendingReply ? "Sending..." : "Send Email"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to permanently delete the enquiry from{" "}
            <strong>{selectedEnquiry?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteOpen(false)}
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
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{
              px: 3,
              borderRadius: "var(--radius-lg)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Enquiries;
