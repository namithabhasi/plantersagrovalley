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
  Search as SearchIcon,
  Email as EmailIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";

const StatusColors = {
  active: { bg: "#e8f5e9", color: "#2e7d32" },
  unsubscribed: { bg: "#ffebee", color: "#b71c1c" },
};

const Subscribers = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  // Compose Newsletter states
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  // Fetch all subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/subscribers/admin");
      if (data.success) {
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  const handleOpenDelete = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubscriber) return;
    try {
      const { data } = await axios.delete(`/subscribers/admin/${selectedSubscriber._id}`);
      if (data.success) {
        toast.success(data.message || "Subscriber deleted successfully");
        setSubscribers((prev) => prev.filter((item) => item._id !== selectedSubscriber._id));
        setDeleteOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete subscriber");
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterSubject.trim() || !newsletterContent.trim()) {
      toast.error("Subject and content are required.");
      return;
    }

    try {
      setSendingNewsletter(true);
      const { data } = await axios.post("/subscribers/admin/send-newsletter", {
        subject: newsletterSubject,
        content: newsletterContent,
      });

      if (data.success) {
        toast.success(data.message || "Newsletter sent successfully!");
        setNewsletterOpen(false);
        setNewsletterSubject("");
        setNewsletterContent("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send newsletter.");
    } finally {
      setSendingNewsletter(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredSubscribers.length === 0) {
      toast.info("No subscribers available to export.");
      return;
    }

    const headers = ["Email Address", "Status", "Date Subscribed"];
    const rows = filteredSubscribers.map((sub) => {
      const d = new Date(sub.createdAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateOnly = `${year}-${month}-${day}`;
      return [
        `"${sub.email}"`,
        `"${sub.status}"`,
        `"${dateOnly}"`
      ];
    });

    const csvString = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  // Filter & Search logic
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const paginatedSubscribers = filteredSubscribers.slice(
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
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Newsletter Subscribers
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Manage email subscriptions for news, exclusive deals, and events
          </Typography>
        </Box>
      </Stack>

      {/* Search, Filters & Action Buttons */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        mb={4}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexGrow: 1 }}
        >
          {/* Search Input */}
          <TextField
            placeholder="Search by email..."
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
              <MenuItem value="all">All Subscribers</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, md: 0 } }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            sx={{ borderRadius: "var(--radius-md)", height: 40, whiteSpace: "nowrap" }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={() => setNewsletterOpen(true)}
            sx={{ borderRadius: "var(--radius-md)", height: 40, bgcolor: "success.main", whiteSpace: "nowrap" }}
          >
            Compose Newsletter
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="success" />
        </Box>
      ) : paginatedSubscribers.length === 0 ? (
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
            No subscribers found
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Subscribed emails from the footer will show up here.
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Date Subscribed</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSubscribers.map((subscriber, index) => (
                  <TableRow key={subscriber._id} hover>
                    <TableCell sx={{ fontSize: "0.85rem" }}>
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {subscriber.email}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {formatDate(subscriber.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscriber.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: StatusColors[subscriber.status]?.bg || "#f1f3f5",
                          color: StatusColors[subscriber.status]?.color || "#495057",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Subscriber">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDelete(subscriber)}
                          size="small"
                          sx={{ bgcolor: "#ffebee", "&:hover": { bgcolor: "#ffcdd2" } }}
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

          <UserPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Subscriber</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to permanently remove{" "}
            <strong>{selectedSubscriber?.email}</strong> from the subscriber list? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compose Newsletter Dialog */}
      <Dialog
        open={newsletterOpen}
        onClose={() => !sendingNewsletter && setNewsletterOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--color-primary)" }}>Compose Subscriber Newsletter</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Write a message to be emailed to all active newsletter subscribers.
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Email Subject"
            type="text"
            fullWidth
            variant="outlined"
            value={newsletterSubject}
            onChange={(e) => setNewsletterSubject(e.target.value)}
            disabled={sendingNewsletter}
            sx={{ mb: 3 }}
          />

          <TextField
            margin="dense"
            label="Email Message Content (HTML or plain text supported)"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={newsletterContent}
            onChange={(e) => setNewsletterContent(e.target.value)}
            disabled={sendingNewsletter}
            placeholder="Type your message details here. You can use standard formatting..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setNewsletterOpen(false)}
            variant="outlined"
            color="inherit"
            disabled={sendingNewsletter}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendNewsletter}
            variant="contained"
            color="success"
            disabled={sendingNewsletter}
            startIcon={sendingNewsletter ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {sendingNewsletter ? "Sending..." : "Send to All"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscribers;
