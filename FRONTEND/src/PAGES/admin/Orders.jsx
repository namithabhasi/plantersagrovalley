import { useState, useEffect } from "react";
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
  Grid,
  Pagination,
  Tooltip,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
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
  Shipped: { bg: "#f3e5f5", color: "#4a148c" },
  Delivered: { bg: "#e8f5e9", color: "#1b5e20" },
  Cancelled: { bg: "#ffebee", color: "#b71c1c" },
};

const PaymentStatusColors = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  Paid: { bg: "#e8f5e9", color: "#1b5e20" },
  Failed: { bg: "#ffebee", color: "#b71c1c" },
  Refunded: { bg: "#e0f7fa", color: "#006064" },
};

const Orders = () => {
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#1b5e20", mb: 0.5 }}>
            Orders Registry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Process sales transactions, track shipments, and manage customer invoices
          </Typography>
        </Box>
      </Stack>

      {/* Filters Card */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search orders by Order # or Customer Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="order-status-filter-label">Order Status</InputLabel>
                <Select
                  labelId="order-status-filter-label"
                  value={orderStatusFilter}
                  label="Order Status"
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  sx={{ borderRadius: 2.5 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="payment-status-filter-label">Payment Status</InputLabel>
                <Select
                  labelId="payment-status-filter-label"
                  value={paymentStatusFilter}
                  label="Payment Status"
                  onChange={(e) => {
                    setPaymentStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  sx={{ borderRadius: 2.5 }}
                >
                  <MenuItem value="all">All Payments</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Refunded">Refunded</MenuItem>
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
      ) : orders.length === 0 ? (
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
                          color: "#1b5e20",
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
                      <Chip label={order.paymentMethod} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1,
                          bgcolor: PaymentStatusColors[order.paymentStatus]?.bg || "#f1f3f5",
                          color: PaymentStatusColors[order.paymentStatus]?.color || "#495057",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1,
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

                        {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
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

      {/* View Order Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth sx={{ borderRadius: 3 }}>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Order details: {selectedOrder?.orderNumber}
          </Typography>
          <IconButton onClick={() => setDetailOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Stepper showing order path */}
              <Grid item xs={12}>
                <Stepper
                  activeStep={
                    ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].indexOf(selectedOrder.orderStatus)
                  }
                  alternativeLabel
                >
                  {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((status) => (
                    <Step key={status} completed={
                      selectedOrder.orderStatus === "Cancelled" 
                        ? false 
                        : ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].indexOf(selectedOrder.orderStatus) >= ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].indexOf(status)
                    }>
                      <StepLabel>{status}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {selectedOrder.orderStatus === "Cancelled" && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: "#ffebee", borderRadius: 2, textAlign: "center" }}>
                    <Typography color="error.main" fontWeight={600}>
                      This order was cancelled on {new Date(selectedOrder.cancelledAt || selectedOrder.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Items Purchased */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Purchased Items
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
                        <TableRow key={index}>
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
                <Box sx={{ mt: 2, ml: "auto", maxWidth: 300 }}>
                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                      <Typography variant="body2" fontWeight={600}>${selectedOrder.subtotal?.toFixed(2)}</Typography>
                    </Stack>
                    {selectedOrder.discountAmount > 0 && (
                      <Stack direction="row" justifyContent="space-between" sx={{ color: "error.main" }}>
                        <Typography variant="body2">Discount:</Typography>
                        <Typography variant="body2" fontWeight={600}>-${selectedOrder.discountAmount?.toFixed(2)}</Typography>
                      </Stack>
                    )}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Tax:</Typography>
                      <Typography variant="body2" fontWeight={600}>${selectedOrder.tax?.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Shipping Charge:</Typography>
                      <Typography variant="body2" fontWeight={600}>${selectedOrder.shippingCharge?.toFixed(2)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" fontWeight={700}>Grand Total:</Typography>
                      <Typography variant="subtitle2" fontWeight={700} color="success.main">${selectedOrder.totalAmount?.toFixed(2)}</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>

              {/* Delivery and Customer details */}
              <Grid item xs={12} md={5}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                      CUSTOMER DETAILS
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {selectedOrder.user?.email || "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {selectedOrder.shippingAddress?.phone}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                      SHIPPING ADDRESS
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedOrder.shippingAddress?.receiverName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress?.addressLine1}
                    </Typography>
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.shippingAddress.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress?.country}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                      TRANSACTION DETAILS
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method: <strong>{selectedOrder.paymentMethod}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status: <strong>{selectedOrder.paymentStatus}</strong>
                    </Typography>
                    {selectedOrder.paidAt && (
                      <Typography variant="body2" color="text.secondary">
                        Paid At: {new Date(selectedOrder.paidAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {selectedOrder.trackingNumber && (
                    <Box sx={{ p: 1.5, bgcolor: "#f1f8e9", borderRadius: 2, display: "flex", gap: 1, alignItems: "center" }}>
                      <ShippingIcon color="success" />
                      <Box>
                        <Typography variant="caption" color="success.main" fontWeight={700}>TRACKING CODE</Typography>
                        <Typography variant="body2" fontWeight={700}>{selectedOrder.trackingNumber}</Typography>
                      </Box>
                    </Box>
                  )}

                  {selectedOrder.notes && (
                    <Box sx={{ p: 1.5, bgcolor: "#fffde7", borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>ORDER NOTES</Typography>
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>"{selectedOrder.notes}"</Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailOpen(false)} variant="outlined" color="success" sx={{ textTransform: "none", borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Order Status Dialog */}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Order Processing Status</DialogTitle>
        <Box component="form" onSubmit={handleStatusSubmit}>
          <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
            <Stack spacing={3}>
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
                  <MenuItem value="Refunded">Refunded</MenuItem>
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
            <Button onClick={() => setStatusOpen(false)} disabled={submitting} sx={{ color: "text.secondary" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success" disabled={submitting} sx={{ borderRadius: 2, px: 3 }}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => !submitting && setDeleteOpen(false)}>
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
          <Button onClick={() => setDeleteOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={submitting} sx={{ px: 3, borderRadius: 2 }}>
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
