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
  Grid,
  Tooltip,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import UserPagination from "../../COMPONENTS/admin/users/UserPagination";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";


const OrderStatusColors = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  Confirmed: { bg: "#e8eaf6", color: "#1a237e" },
  Processing: { bg: "#e1f5fe", color: "#01579b" },
  Packed: { bg: "#e0f2f1", color: "#00695c" },
  Shipped: { bg: "#f3e5f5", color: "#4a148c" },
  Delivered: { bg: "success.light", color: "success.main" },
  Cancelled: { bg: "#ffebee", color: "#b71c1c" },
};

const PaymentStatusColors = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  Paid: { bg: "success.light", color: "success.main" },
  Failed: { bg: "#ffebee", color: "#b71c1c" },
  Refunded: { bg: "#e0f7fa", color: "#006064" },
};

const Orders = () => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Update order states
  const [updateData, setUpdateData] = useState({
    orderStatus: "",
    paymentStatus: "",
    trackingNumber: "",
    estimatedDelivery: "",
  });

  // Fetch all orders with filters and pagination
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (orderStatusFilter !== "all") {
        params.status = orderStatusFilter;
      }

      if (paymentStatusFilter !== "all") {
        params.paymentStatus = paymentStatusFilter;
      }

      const { data } = await axios.get("/orders", { params });
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalOrders(data.pagination?.totalOrders || 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [page, searchQuery, orderStatusFilter, paymentStatusFilter]);

  // Open order detail dialog
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  // Open status update dialog
  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      orderStatus: order.orderStatus || "",
      paymentStatus: order.paymentStatus || "",
      trackingNumber: order.trackingNumber || "",
      estimatedDelivery: order.estimatedDelivery 
        ? new Date(order.estimatedDelivery).toISOString().substring(0, 10) 
        : "",
    });
    setStatusOpen(true);
  };

  // Open delete confirm dialog
  const handleOpenDeleteDialog = (order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  // Submit Order Status Update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await axios.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: updateData.orderStatus,
        paymentStatus: updateData.paymentStatus,
        trackingNumber: updateData.trackingNumber,
        estimatedDelivery: updateData.estimatedDelivery || null,
      });

      if (data.success) {
        toast.success("Order status updated successfully");
        setStatusOpen(false);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Order Quick Action
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setLoading(true);
      const { data } = await axios.put(`/orders/${orderId}/cancel`);
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  // Delete Order (Soft Delete)
  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.delete(`/orders/${selectedOrder._id}`);
      if (data.success) {
        toast.success("Order deleted successfully");
        setDeleteOpen(false);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Orders Registry
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }} variant="body2" color="text.secondary">
          Process sales transactions, track shipments, and manage customer invoices
        </Typography>
      </Box>

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
          <TextField
            placeholder="Search orders by Order # or Customer Name..."
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

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="order-status-filter-label">Order Status</InputLabel>
            <Select
              labelId="order-status-filter-label"
              value={orderStatusFilter}
              label="Order Status"
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
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
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Packed">Packed</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="payment-status-filter-label">Payment Status</InputLabel>
            <Select
              labelId="payment-status-filter-label"
              value={paymentStatusFilter}
              label="Payment Status"
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
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
              <MenuItem value="all">All Payments</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
              <MenuItem value="Refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Main Table */}
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress color="success" />
        </Stack>
      ) : orders.length === 0 ? (
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
            No orders found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your search criteria or filters.
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Order Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Order Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          fontFamily: "monospace",
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => handleViewOrder(order)}
                      >
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.shippingAddress?.receiverName || `${order.user?.firstName || ""} ${order.user?.lastName || ""}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {order.user?.email || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        ${order.totalAmount?.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {order.items?.length || 0} items
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={order.paymentMethod} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        color={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : order.paymentStatus === "Failed"
                            ? "error"
                            : order.paymentStatus === "Pending"
                            ? "warning"
                            : "info"
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: OrderStatusColors[order.orderStatus]?.bg || "#f1f3f5",
                          color: OrderStatusColors[order.orderStatus]?.color || "#495057",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleViewOrder(order)}
                            sx={{ bgcolor: "#e0f7fa", "&:hover": { bgcolor: "#b2ebf2" } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Update Status">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenStatusDialog(order)}
                            sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {role !== "shipping-manager" && order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                          <Tooltip title="Cancel Order">
                            <IconButton
                              color="warning"
                              size="small"
                              onClick={() => handleCancelOrder(order._id)}
                              sx={{ bgcolor: "#fff3e0", "&:hover": { bgcolor: "#ffe0b2" } }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {role === "super-admin" && (
                          <Tooltip title="Delete Order (Soft)">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDeleteDialog(order)}
                              sx={{ bgcolor: "#ffebee", "&:hover": { bgcolor: "#ffcdd2" } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
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

      {/* View Order Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
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
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Order details: {selectedOrder?.orderNumber}
          </Typography>
          <IconButton onClick={() => setDetailOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: "#fafbfa" }}>
          {selectedOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              {/* Stepper showing order path - full width */}
              <Box sx={{ width: "100%", p: 3, bgcolor: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", boxShadow: "none" }}>
                <Stepper
                  activeStep={
                    ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].indexOf(selectedOrder.orderStatus)
                  }
                  alternativeLabel
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    "& .MuiStep-root": {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    },
                    "& .MuiStepLabel-root": {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    },
                    "& .MuiStepLabel-labelContainer": {
                      width: "100%",
                      textAlign: "center",
                      mt: 1.5,
                    },
                    "& .MuiStepLabel-label": {
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      color: "text.secondary",
                      "&.Mui-active": {
                        color: "primary.main",
                        fontWeight: 700,
                      },
                      "&.Mui-completed": {
                        color: "success.main",
                        fontWeight: 700,
                      }
                    },
                    "& .MuiStepIcon-root": {
                      width: 28,
                      height: 28,
                      "&.Mui-active": {
                        color: "primary.main",
                      },
                      "&.Mui-completed": {
                        color: "success.main",
                      }
                    }
                  }}
                >
                  {["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].map((status) => (
                    <Step key={status} completed={
                      selectedOrder.orderStatus === "Cancelled" 
                        ? false 
                        : ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].indexOf(selectedOrder.orderStatus) >= ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].indexOf(status)
                    }>
                      <StepLabel>{status}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {selectedOrder.orderStatus === "Cancelled" && (
                  <Box sx={{ mt: 2.5, p: 1.5, bgcolor: "#ffebee", borderRadius: "var(--radius-lg)", textAlign: "center", border: "1px solid #ffcdd2" }}>
                    <Typography color="error.main" fontWeight={600} variant="body2">
                      This order was cancelled on {new Date(selectedOrder.cancelledAt || selectedOrder.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Two columns below the Stepper */}
              <Grid container spacing={3.5} alignItems="stretch">
                {/* Left Column: Customer details (xs={12} md={5}) */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={2.5} sx={{ height: "100%" }}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "var(--radius-lg)", bgcolor: "#ffffff", borderColor: "var(--color-border)" }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 1.5, letterSpacing: 0.5 }}>
                        CUSTOMER DETAILS
                      </Typography>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email: {selectedOrder.user?.email || "—"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {selectedOrder.shippingAddress?.phone}
                      </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "var(--radius-lg)", bgcolor: "#ffffff", borderColor: "var(--color-border)" }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 1.5, letterSpacing: 0.5 }}>
                        SHIPPING ADDRESS
                      </Typography>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        {selectedOrder.shippingAddress?.receiverName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {selectedOrder.shippingAddress?.addressLine1}
                      </Typography>
                      {selectedOrder.shippingAddress?.addressLine2 && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {selectedOrder.shippingAddress.addressLine2}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.shippingAddress?.country}
                      </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "var(--radius-lg)", bgcolor: "#ffffff", borderColor: "var(--color-border)" }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 1.5, letterSpacing: 0.5 }}>
                        TRANSACTION DETAILS
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedOrder.paymentMethod}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedOrder.paymentStatus}</Typography>
                        </Box>
                        {selectedOrder.paidAt && (
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">Paid At:</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(selectedOrder.paidAt).toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>

                    {selectedOrder.trackingNumber && (
                      <Box sx={{ p: 2, bgcolor: "#f1f8e9", borderRadius: "var(--radius-lg)", display: "flex", gap: 1.5, alignItems: "center", border: "1px solid #dcedc8" }}>
                        <ShippingIcon color="success" />
                        <Box>
                          <Typography variant="caption" color="success.main" fontWeight={700}>TRACKING CODE</Typography>
                          <Typography variant="body2" fontWeight={700}>{selectedOrder.trackingNumber}</Typography>
                        </Box>
                      </Box>
                    )}

                    {selectedOrder.notes && (
                      <Box sx={{ p: 2, bgcolor: "#fffde7", borderRadius: "var(--radius-lg)", border: "1px solid #fff9c4" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>ORDER NOTES</Typography>
                        <Typography variant="body2" sx={{ fontStyle: "italic", mt: 0.5 }}>"{selectedOrder.notes}"</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                {/* Right Column: Items Purchased (xs={12} md={7}) */}
                <Grid item xs={12} md={7}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: "var(--radius-lg)", bgcolor: "#ffffff", borderColor: "var(--color-border)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                      Purchased Items
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "var(--radius-lg)", borderColor: "var(--color-border)", overflow: "hidden", flexGrow: 1 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items?.map((item, index) => (
                            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
                                {item.image ? (
                                  <Box component="img" src={item.image} sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: "cover" }} />
                                ) : (
                                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: "#eee" }} />
                                )}
                                <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                              </TableCell>
                              <TableCell align="center">{item.quantity}</TableCell>
                              <TableCell align="right">${item.price?.toFixed(2)}</TableCell>
                              <TableCell align="right">${(item.quantity * item.price)?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Subtotals & Taxes */}
                    <Box sx={{ mt: 3, ml: "auto", width: "100%", maxWidth: 320 }}>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                          <Typography variant="body2" fontWeight={600}>${selectedOrder.subtotal?.toFixed(2)}</Typography>
                        </Box>
                        {selectedOrder.discountAmount > 0 && (
                          <Box sx={{ display: "flex", justifyContent: "space-between", color: "error.main" }}>
                            <Typography variant="body2">Discount:</Typography>
                            <Typography variant="body2" fontWeight={600}>-${selectedOrder.discountAmount?.toFixed(2)}</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">Tax:</Typography>
                          <Typography variant="body2" fontWeight={600}>${selectedOrder.tax?.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">Shipping Charge:</Typography>
                          <Typography variant="body2" fontWeight={600}>${selectedOrder.shippingCharge?.toFixed(2)}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="subtitle2" fontWeight={700}>Grand Total:</Typography>
                          <Typography variant="subtitle2" fontWeight={700} color="success.main">${selectedOrder.totalAmount?.toFixed(2)}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8f9fa", borderTop: "1px solid #eef2ed" }}>
          <Button
            onClick={() => setDetailOpen(false)}
            variant="outlined"
            sx={{
              color: "var(--color-primary)",
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-lg)",
              textTransform: "none",
              px: 3,
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

      {/* Update Order Status Dialog */}
      <Dialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: "var(--radius-lg)" }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Order Processing Status</DialogTitle>
        <Box component="form" onSubmit={handleStatusSubmit}>
          <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
            <Stack spacing={3} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "var(--radius-lg)" } }}>
              <FormControl fullWidth required>
                <InputLabel id="update-order-status-label">Order Status</InputLabel>
                <Select
                  labelId="update-order-status-label"
                  value={updateData.orderStatus}
                  label="Order Status"
                  onChange={handleInputChange}
                  name="orderStatus"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Packed">Packed</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel id="update-payment-status-label">Payment Status</InputLabel>
                <Select
                  labelId="update-payment-status-label"
                  value={updateData.paymentStatus}
                  label="Payment Status"
                  onChange={handleInputChange}
                  name="paymentStatus"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Refunded" disabled={role === "shipping-manager"}>Refunded</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Tracking Number / Waybill"
                value={updateData.trackingNumber}
                onChange={handleInputChange}
                name="trackingNumber"
                helperText="Provide when order is Shipped"
              />

              <TextField
                fullWidth
                type="date"
                label="Estimated Delivery Date"
                value={updateData.estimatedDelivery}
                onChange={handleInputChange}
                name="estimatedDelivery"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setStatusOpen(false)}
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
              {submitting ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
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
            sx: { borderRadius: "var(--radius-lg)" }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Order Record</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the order record <strong>{selectedOrder?.orderNumber}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
            This is a soft delete and will hide the record from active view.
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
            sx={{ px: 3, borderRadius: "var(--radius-lg)" }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
