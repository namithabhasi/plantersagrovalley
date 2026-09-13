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
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  Button,
} from "@mui/material";
import { Security, History, Refresh } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/admin/audit-logs?page=${page}&limit=20`);
      if (data.success) {
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setTotalLogs(data.total);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            📜 Immutable System Audit Log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Super Admin security trail recording all critical administrative changes, hard purges, role updates, and payment key modifications.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAuditLogs}>
          Refresh Logs
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell fontWeight="bold">Timestamp</TableCell>
              <TableCell fontWeight="bold">User / Actor</TableCell>
              <TableCell fontWeight="bold">Role</TableCell>
              <TableCell fontWeight="bold">Action</TableCell>
              <TableCell fontWeight="bold">Module</TableCell>
              <TableCell fontWeight="bold">Action Details</TableCell>
              <TableCell fontWeight="bold">IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading audit trail...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No audit logs recorded yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {log.userName || "System"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {log.user?.slice(-6) || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.role}
                      size="small"
                      color={log.role === "super-admin" || log.role === "superadmin" ? "error" : "primary"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="secondary.main">
                      {log.action}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={log.module} size="small" variant="filled" color="default" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" fontFamily="monospace">
                      {JSON.stringify(log.details || {})}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      {log.ipAddress || "::1"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
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
    </Box>
  );
};

export default AuditLogs;
