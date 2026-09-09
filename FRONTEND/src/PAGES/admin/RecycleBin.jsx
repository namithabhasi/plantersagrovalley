import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { RestoreFromTrash, UploadFile, DeleteSweep, Refresh } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const RecycleBin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bulk Import Modal
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importing, setImporting] = useState(false);

  const fetchRecycleBin = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products/recycle-bin");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch recycle bin products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const handleRestore = async (id, name) => {
    try {
      const { data } = await axiosInstance.put(`/products/${id}/restore`);
      if (data.success) {
        toast.success(data.message);
        fetchRecycleBin();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore product.");
    }
  };

  const handleBulkImport = async () => {
    if (!importJsonText.trim()) {
      toast.error("Please paste JSON product data to import.");
      return;
    }

    try {
      setImporting(true);
      let parsedProducts;
      try {
        parsedProducts = JSON.parse(importJsonText);
        if (!Array.isArray(parsedProducts)) {
          parsedProducts = [parsedProducts];
        }
      } catch (err) {
        toast.error("Invalid JSON format. Please format as a JSON array of product objects.");
        setImporting(false);
        return;
      }

      const { data } = await axiosInstance.post("/products/bulk-import", {
        products: parsedProducts,
      });

      if (data.success) {
        toast.success(data.message);
        setImportDialogOpen(false);
        setImportJsonText("");
        fetchRecycleBin();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to perform bulk import.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ♻️ Catalog Recycle Bin & Bulk Import
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Restore delisted or trashed products, or import catalog products in bulk using structured JSON data.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchRecycleBin}>
            Refresh
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<UploadFile />}
            onClick={() => setImportDialogOpen(true)}
          >
            Bulk Import Products
          </Button>
        </Stack>
      </Box>

      {/* Recycle Bin Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell fontWeight="bold">Product Name</TableCell>
              <TableCell fontWeight="bold">SKU</TableCell>
              <TableCell fontWeight="bold">Category</TableCell>
              <TableCell fontWeight="bold">Price</TableCell>
              <TableCell fontWeight="bold">Status</TableCell>
              <TableCell fontWeight="bold">Delisted / Trashed At</TableCell>
              <TableCell fontWeight="bold" align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Recycle bin is empty. No delisted or deleted products.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((prod) => (
                <TableRow key={prod._id} hover>
                  <TableCell fontWeight="bold">{prod.name}</TableCell>
                  <TableCell fontStyle="monospace">{prod.sku}</TableCell>
                  <TableCell>{prod.category?.name || "N/A"}</TableCell>
                  <TableCell>₹{prod.price}</TableCell>
                  <TableCell>
                    {prod.isDelisted && <Chip label="Delisted" size="small" color="warning" sx={{ mr: 0.5 }} />}
                    {prod.isDeleted && <Chip label="Soft Deleted" size="small" color="error" />}
                  </TableCell>
                  <TableCell>{new Date(prod.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<RestoreFromTrash />}
                      onClick={() => handleRestore(prod._id, prod.name)}
                    >
                      Restore Product
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📥 Bulk Import Catalog Products (JSON)
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Paste a JSON array of product objects with fields: <b>name</b>, <b>sku</b>, <b>price</b>, <b>category</b> (Category Mongo ID), <b>description</b>, <b>stock</b>.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={10}
            placeholder={`[
  {
    "name": "Organic Neem Fertilizer",
    "sku": "NEEM-500G",
    "price": 299,
    "category": "64f1a2b3c4d5e6f7a8b9c0d1",
    "stock": 50,
    "description": "100% pure organic neem cake fertilizer"
  }
]`}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            fontFamily="monospace"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            disabled={importing}
            onClick={handleBulkImport}
            startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <UploadFile />}
          >
            {importing ? "Importing..." : "Start Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecycleBin;
