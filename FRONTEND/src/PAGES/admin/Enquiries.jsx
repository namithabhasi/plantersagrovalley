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

  const getStatusChipColor = (status) => {
    switch (status) {
      case "unread":
        return "error";
      case "read":
        return "warning";
      case "replied":
        return "success";
      default:
        return "default";
    }
  };

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
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Contact Enquiries
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            View and manage message submissions from customers on the Contact page
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            {/* Search Input */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, phone or comment..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
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
            />

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 160, width: { xs: "100%", md: "auto" } }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All Enquiries</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="replied">Replied</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="success" />
        </Box>
      ) : paginatedEnquiries.length === 0 ? (
        <Paper sx={{ py: 8, px: 2, textCenter: "center", borderRadius: 2, textAlign: "center" }}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Table>
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Details</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Message Preview</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>Actions</TableCell>
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
                        color={getStatusChipColor(enquiry.status)}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.7rem", borderRadius: "4px" }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Tooltip title="View Message">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDetail(enquiry)}
                          size="small"
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
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid", borderColor: "grey.100" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Enquiry Details
            </Typography>
            {selectedEnquiry && (
              <Chip
                label={selectedEnquiry.status.toUpperCase()}
                color={getStatusChipColor(selectedEnquiry.status)}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: "4px" }}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedEnquiry && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} uppercase sx={{ display: "block", mb: 0.5 }}>
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

              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
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
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid", borderColor: "grey.100" }}>
          {selectedEnquiry && selectedEnquiry.status !== "replied" && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<ReplyIcon />}
              onClick={handleOpenReply}
            >
              Reply via Email
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={() => setDetailOpen(false)}>
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
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h6" fontWeight={600}>
            Reply to Enquiry
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
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
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid", borderColor: "grey.100" }}>
          <Button variant="outlined" onClick={() => setReplyOpen(false)} disabled={sendingReply}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ReplyIcon />}
            onClick={handleSendReply}
            disabled={sendingReply}
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
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to permanently delete the enquiry from{" "}
            <strong>{selectedEnquiry?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button variant="outlined" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Enquiries;
