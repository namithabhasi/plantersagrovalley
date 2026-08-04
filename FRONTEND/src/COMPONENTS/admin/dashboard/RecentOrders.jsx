import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "success";
    case "processing":
      return "warning";
    case "shipped":
      return "info";
    case "cancelled":
      return "error";
    case "pending":
      return "default";
    default:
      return "default";
  }
};

const RecentOrders = ({ orders = [] }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "var(--radius-lg)",
        borderColor: "var(--color-border)",
        mb: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          Recent Orders
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      {order.orderNumber || order._id}
                    </TableCell>

                    <TableCell>
                      {order.user ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {`${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || "N/A"}
                          </Typography>
                          {order.user.phone && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {order.user.phone}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell>
                      ₹{Number(order.totalAmount || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No recent orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;