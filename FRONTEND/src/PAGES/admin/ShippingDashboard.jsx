import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  MenuItem,
  Menu,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
  Divider,
  Pagination,
} from "@mui/material";
import {
  LocalShipping,
  AssignmentTurnedIn,
  Inventory,
  WarningAmber,
  Search,
  ReceiptLong,
  Comment,
  Send,
  Print,
  Refresh,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const COURIER_OPTIONS = ["Delhivery", "BlueDart", "DTDC", "FedEx", "India Post", "Ekart", "Shadowfax"];
const TRANSIT_STATUSES = ["Pending Dispatch", "In Transit", "Out for Delivery", "Delivered", "RTO Initiated", "RTO In Transit", "RTO Delivered"];

const ShippingDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courierFilter, setCourierFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pendingCount: 0, inTransitCount: 0, deliveredCount: 0, rtoCount: 0 });

  // Modal states
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [courierPartner, setCourierPartner] = useState("");
  const [awbTrackingNumber, setAwbTrackingNumber] = useState("");
  const [shippingNotes, setShippingNotes] = useState("");

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedTransitStatus, setSelectedTransitStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  // Internal notes modal
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  // Manifest modal
  const [manifestModalOpen, setManifestModalOpen] = useState(false);
  const [generatedManifest, setGeneratedManifest] = useState(null);

  // Action Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeMenuOrder, setActiveMenuOrder] = useState(null);

  const handleOpenMenu = (event, order) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveMenuOrder(order);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActiveMenuOrder(null);
  };

  const fetchShippingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search,
        status: statusFilter,
        courier: courierFilter,
      };
      const { data } = await axiosInstance.get("/shipping/orders", { params });
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch shipping orders.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, courierFilter]);

  useEffect(() => {
    fetchShippingOrders();
  }, [fetchShippingOrders]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map((o) => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openDispatchDialog = (order) => {
    setActiveOrder(order);
    setCourierPartner(order.courierPartner || "Delhivery");
    setAwbTrackingNumber(order.awbTrackingNumber || order.trackingNumber || "");
    setShippingNotes(order.shippingNotes || "");
    setDispatchModalOpen(true);
  };

  const handleDispatchSubmit = async () => {
    if (!courierPartner || !awbTrackingNumber) {
      toast.error("Please provide courier partner and AWB tracking number.");
      return;
    }
    try {
      const { data } = await axiosInstance.post(`/shipping/orders/${activeOrder._id}/dispatch`, {
        courierPartner,
        awbTrackingNumber,
        shippingNotes,
      });
      if (data.success) {
        toast.success(data.message);
        setDispatchModalOpen(false);
        fetchShippingOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to dispatch order.");
    }
  };

  const openStatusDialog = (order) => {
    setActiveOrder(order);
    setSelectedTransitStatus(order.transitStatus || "In Transit");
    setStatusNote("");
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async () => {
    try {
      const { data } = await axiosInstance.put(`/shipping/orders/${activeOrder._id}/transit-status`, {
        transitStatus: selectedTransitStatus,
        note: statusNote,
      });
      if (data.success) {
        toast.success(data.message);
        setStatusModalOpen(false);
        fetchShippingOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update transit status.");
    }
  };

  const openNotesDialog = (order) => {
    setActiveOrder(order);
    setNewNote("");
    setNotesModalOpen(true);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const { data } = await axiosInstance.post(`/shipping/orders/${activeOrder._id}/notes`, {
        note: newNote,
      });
      if (data.success) {
        toast.success("Note added successfully.");
        setActiveOrder({ ...activeOrder, internalNotes: data.internalNotes });
        setNewNote("");
        fetchShippingOrders();
      }
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };

  const handleGenerateManifest = async () => {
    if (selectedOrders.length === 0) {
      toast.warn("Select at least one order to generate a manifest.");
      return;
    }
    try {
      const { data } = await axiosInstance.post("/shipping/manifests", {
        orderIds: selectedOrders,
      });
      if (data.success) {
        setGeneratedManifest(data);
        setManifestModalOpen(true);
        setSelectedOrders([]);
        fetchShippingOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate manifest.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            📦 Logistics & Shipping Manager Portal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage AWB tracking, courier dispatch, daily batch manifests, and RTO inspections.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchShippingOrders}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ReceiptLong />}
            disabled={selectedOrders.length === 0}
            onClick={handleGenerateManifest}
          >
            Generate Manifest ({selectedOrders.length})
          </Button>
        </Stack>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => { setStatusFilter("Pending Dispatch"); setPage(1); }}
            sx={{ bgcolor: "#fff8e1", borderLeft: "4px solid #ffa000", cursor: "pointer", "&:hover": { boxShadow: 3 } }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  PENDING DISPATCH
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#b78103">
                  {stats.pendingCount}
                </Typography>
              </Box>
              <Inventory sx={{ fontSize: 40, color: "#ffa000" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => { setStatusFilter("In Transit"); setPage(1); }}
            sx={{ bgcolor: "#e3f2fd", borderLeft: "4px solid #1976d2", cursor: "pointer", "&:hover": { boxShadow: 3 } }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  IN TRANSIT
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1565c0">
                  {stats.inTransitCount}
                </Typography>
              </Box>
              <LocalShipping sx={{ fontSize: 40, color: "#1976d2" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => { setStatusFilter("Delivered"); setPage(1); }}
            sx={{ bgcolor: "#e8f5e9", borderLeft: "4px solid #2e7d32", cursor: "pointer", "&:hover": { boxShadow: 3 } }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  DELIVERED
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                  {stats.deliveredCount}
                </Typography>
              </Box>
              <AssignmentTurnedIn sx={{ fontSize: 40, color: "#2e7d32" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => { setStatusFilter("RTO"); setPage(1); }}
            sx={{ bgcolor: "#ffebee", borderLeft: "4px solid #c62828", cursor: "pointer", "&:hover": { boxShadow: 3 } }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  RTO / EXCEPTIONS
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#c62828">
                  {stats.rtoCount}
                </Typography>
              </Box>
              <WarningAmber sx={{ fontSize: 40, color: "#c62828" }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Order #, AWB, Receiver Name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Filter Transit Status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {TRANSIT_STATUSES.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Filter Courier Partner"
              value={courierFilter}
              onChange={(e) => { setCourierFilter(e.target.value); setPage(1); }}
            >
              <MenuItem value="all">All Couriers</MenuItem>
              {COURIER_OPTIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                  checked={orders.length > 0 && selectedOrders.length === orders.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell fontWeight="bold">Order #</TableCell>
              <TableCell fontWeight="bold">Recipient & Phone</TableCell>
              <TableCell fontWeight="bold">Courier Partner</TableCell>
              <TableCell fontWeight="bold">AWB / Tracking</TableCell>
              <TableCell fontWeight="bold">Transit Status</TableCell>
              <TableCell fontWeight="bold">Manifest ID</TableCell>
              <TableCell fontWeight="bold" align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading shipping records...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No shipping orders found matching criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const isSelected = selectedOrders.includes(order._id);
                return (
                  <TableRow key={order._id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOrder(order._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{order.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {order.shippingAddress?.receiverName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        📞 {order.shippingAddress?.phone} | {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.courierPartner ? (
                        <Chip label={order.courierPartner} size="small" color="primary" variant="outlined" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.awbTrackingNumber || order.trackingNumber ? (
                        <Typography variant="body2" fontFamily="monospace" fontWeight="bold" color="secondary.main">
                          {order.awbTrackingNumber || order.trackingNumber}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="error">No AWB</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const statusText = order.orderStatus === "Delivered"
                          ? "Delivered"
                          : order.orderStatus === "Cancelled"
                          ? "Cancelled"
                          : order.orderStatus === "Out for Delivery"
                          ? "Out for Delivery"
                          : order.orderStatus === "Return Requested"
                          ? "RTO Initiated"
                          : order.orderStatus === "Return Approved"
                          ? "RTO In Transit"
                          : order.orderStatus === "Returned"
                          ? "RTO Delivered"
                          : (order.transitStatus && order.transitStatus !== "Pending Dispatch")
                          ? order.transitStatus
                          : order.orderStatus === "Shipped"
                          ? "In Transit"
                          : "Pending Dispatch";

                        const color = statusText === "Delivered" ? "success" :
                          statusText === "In Transit" || statusText === "Shipped" || statusText === "Out for Delivery" ? "info" :
                          statusText === "RTO Delivered" ? "secondary" :
                          statusText.includes("RTO") || statusText === "Cancelled" ? "error" : "warning";

                        return <Chip label={statusText} size="small" color={color} />;
                      })()}
                    </TableCell>
                    <TableCell>
                      {order.shippingManifestId ? (
                        <Chip label={order.shippingManifestId} size="small" variant="filled" color="default" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleOpenMenu(e, order)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => { handleCloseMenu(); openDispatchDialog(activeMenuOrder); }}>
          <Send fontSize="small" sx={{ mr: 1, color: "primary.main" }} /> Dispatch / Edit AWB
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); openStatusDialog(activeMenuOrder); }}>
          <LocalShipping fontSize="small" sx={{ mr: 1, color: "info.main" }} /> Update Transit Status
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); openNotesDialog(activeMenuOrder); }}>
          <Comment fontSize="small" sx={{ mr: 1, color: "secondary.main" }} /> Internal Notes
        </MenuItem>
      </Menu>

      {/* Dispatch Dialog */}
      <Dialog open={dispatchModalOpen} onClose={() => setDispatchModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          🚀 Dispatch Order #{activeOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Courier Partner"
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
              >
                {COURIER_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="AWB Tracking Number"
                placeholder="e.g. DEL123456789IN"
                value={awbTrackingNumber}
                onChange={(e) => setAwbTrackingNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Shipping / Packaging Notes"
                placeholder="e.g. Fragile live plants - fragile sticker attached"
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDispatchModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleDispatchSubmit}>
            Save & Mark Dispatched
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transit Status Dialog */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          🔄 Update Transit Status - Order #{activeOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="New Transit Status"
                value={selectedTransitStatus}
                onChange={(e) => setSelectedTransitStatus(e.target.value)}
              >
                {TRANSIT_STATUSES.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Status Note / Log"
                placeholder="e.g. Out for delivery with delivery agent Rahul"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleStatusSubmit}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Internal Notes Dialog */}
      <Dialog open={notesModalOpen} onClose={() => setNotesModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📝 Internal Logistics Notes - #{activeOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}>
            {activeOrder?.internalNotes && activeOrder.internalNotes.length > 0 ? (
              activeOrder.internalNotes.map((noteItem, idx) => (
                <Box key={idx} sx={{ p: 1.5, mb: 1, bgcolor: "#f9f9f9", borderRadius: 1, borderLeft: "3px solid #1976d2" }}>
                  <Typography variant="body2">{noteItem.note}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {noteItem.addedBy} on {new Date(noteItem.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No internal notes recorded for this order yet.
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write internal note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesModalOpen(false)}>Close</Button>
          <Button variant="contained" color="secondary" onClick={handleAddNote}>
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manifest Modal */}
      <Dialog open={manifestModalOpen} onClose={() => setManifestModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>📋 Daily Dispatch Manifest - {generatedManifest?.manifestId}</span>
          <Button startIcon={<Print />} variant="outlined" size="small" onClick={() => window.print()}>
            Print Manifest
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Manifest Date: {generatedManifest?.manifestDate ? new Date(generatedManifest.manifestDate).toLocaleString() : ""}
            </Typography>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Total Orders Manifested: {generatedManifest?.orders?.length}
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#eee" }}>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>City & Pincode</TableCell>
                    <TableCell>Courier</TableCell>
                    <TableCell>AWB Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generatedManifest?.orders?.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell fontWeight="bold">#{o.orderNumber}</TableCell>
                      <TableCell>{o.shippingAddress?.receiverName}</TableCell>
                      <TableCell>{o.shippingAddress?.city} ({o.shippingAddress?.postalCode})</TableCell>
                      <TableCell>{o.courierPartner || "N/A"}</TableCell>
                      <TableCell fontStyle="monospace">{o.awbTrackingNumber || o.trackingNumber || "Pending"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setManifestModalOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingDashboard;
