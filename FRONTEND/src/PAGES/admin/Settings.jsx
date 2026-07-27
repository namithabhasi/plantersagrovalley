import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Public as SeoIcon,
  Share as SocialsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    currencySymbol: "",
    taxPercentage: 0,
    shippingCharge: 0,
    freeShippingMinimumOrder: 0,
    maintenanceMode: false,
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    paymentGateway: {
      razorpayKeyId: "",
      razorpayEnabled: true,
      codEnabled: true,
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
    productsPerPage: 12,
    orderSettings: {
      allowCancellation: true,
      cancellationHours: 24,
    },
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/settings");
      if (data.success && data.settings) {
        const s = data.settings;
        setFormData({
          storeName: s.storeName || "",
          storeEmail: s.storeEmail || "",
          storePhone: s.storePhone || "",
          address: s.address || { line1: "", city: "", state: "", country: "", postalCode: "" },
          currencySymbol: s.currencySymbol || "$",
          taxPercentage: s.taxPercentage || 0,
          shippingCharge: s.shippingCharge || 0,
          freeShippingMinimumOrder: s.freeShippingMinimumOrder || 0,
          maintenanceMode: !!s.maintenanceMode,
          socialLinks: s.socialLinks || { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "" },
          paymentGateway: s.paymentGateway || { razorpayKeyId: "", razorpayEnabled: true, codEnabled: true },
          seo: s.seo || { metaTitle: "", metaDescription: "", metaKeywords: "" },
          productsPerPage: s.productsPerPage || 12,
          orderSettings: s.orderSettings || { allowCancellation: true, cancellationHours: 24 },
        });
        setLogoPreview(s.storeLogo?.url || "");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load store settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper for updating nested objects
  const handleNestedChange = (parentField, childField, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value,
      },
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file size must not exceed 2MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleClearLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      data.append("storeName", formData.storeName);
      data.append("storeEmail", formData.storeEmail);
      data.append("storePhone", formData.storePhone);
      data.append("currencySymbol", formData.currencySymbol);
      data.append("taxPercentage", formData.taxPercentage);
      data.append("shippingCharge", formData.shippingCharge);
      data.append("freeShippingMinimumOrder", formData.freeShippingMinimumOrder);
      data.append("maintenanceMode", formData.maintenanceMode);
      data.append("productsPerPage", formData.productsPerPage);

      // Append stringified nested fields
      data.append("address", JSON.stringify(formData.address));
      data.append("socialLinks", JSON.stringify(formData.socialLinks));
      data.append("paymentGateway", JSON.stringify(formData.paymentGateway));
      data.append("seo", JSON.stringify(formData.seo));
      data.append("orderSettings", JSON.stringify(formData.orderSettings));

      if (logoFile) {
        data.append("logo", logoFile);
      } else if (!logoPreview) {
        // If logo was cleared
        data.append("storeLogo", JSON.stringify({ url: "", public_id: "" }));
      }

      const response = await axios.put("/settings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Settings saved successfully");
        fetchSettings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: "70vh" }}>
        <CircularProgress color="success" />
      </Stack>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
            Store Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure system configurations, payment processors, tax schedules, shipping policies, and search parameters
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left panel: Tabs selector */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
              <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : undefined}
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderRight: 0,
                  "& .MuiTabs-indicator": { bgcolor: "success.main" },
                  "& .MuiTab-root": {
                    alignItems: { xs: "center", md: "flex-start" },
                    textAlign: { xs: "center", md: "left" },
                    py: 2,
                    px: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 1,
                    "&.Mui-selected": { color: "success.main" },
                  },
                }}
              >
                <Tab icon={<SettingsIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="General Info" />
                <Tab icon={<ShippingIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Shipping & Tax" />
                <Tab icon={<PaymentIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Payment Gateways" />
                <Tab icon={<SeoIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="SEO & Search" />
                <Tab icon={<SocialsIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Social Connections" />
              </Tabs>
            </Card>
          </Grid>

          {/* Right panel: Content forms */}
          <Grid item xs={12} md={9}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.02)", border: "1px solid #f0f0f0" }}>
              <CardContent sx={{ p: 4 }}>
                {/* Tab 0: General Info */}
                {tabValue === 0 && (
                  <Stack spacing={3.5}>
                    <Typography variant="h6" fontWeight={700}>General Store Information</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Store Name"
                          value={formData.storeName}
                          onChange={handleInputChange}
                          name="storeName"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Store Contact Email"
                          value={formData.storeEmail}
                          onChange={handleInputChange}
                          name="storeEmail"
                          required
                          type="email"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Store Contact Phone"
                          value={formData.storePhone}
                          onChange={handleInputChange}
                          name="storePhone"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Currency Symbol"
                          value={formData.currencySymbol}
                          onChange={handleInputChange}
                          name="currencySymbol"
                          required
                          placeholder="e.g. $, ₹, €"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Products Displayed Per Page"
                          value={formData.productsPerPage}
                          onChange={handleInputChange}
                          name="productsPerPage"
                          required
                          slotProps={{ htmlInput: { min: 1, max: 100 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.maintenanceMode}
                              onChange={(e) => handleInputChange({ target: { name: "maintenanceMode", value: e.target.checked } })}
                              color="error"
                            />
                          }
                          label="Activate Storefront Maintenance Mode"
                        />
                      </Grid>
                    </Grid>

                    <Divider />
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">STORE PHYSICAL ADDRESS</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address Line 1"
                          value={formData.address.line1}
                          onChange={(e) => handleNestedChange("address", "line1", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="City"
                          value={formData.address.city}
                          onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="State"
                          value={formData.address.state}
                          onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={formData.address.postalCode}
                          onChange={(e) => handleNestedChange("address", "postalCode", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={formData.address.country}
                          onChange={(e) => handleNestedChange("address", "country", e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <Divider />
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">STORE LOGO</Typography>
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      {logoPreview ? (
                        <Box sx={{ position: "relative", width: 100, height: 100 }}>
                          <Box
                            component="img"
                            src={logoPreview}
                            alt="Logo"
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 2,
                              objectFit: "contain",
                              border: "1px solid #e0e0e0",
                              p: 0.5,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={handleClearLogo}
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              bgcolor: "#ef5350",
                              color: "white",
                              p: 0.2,
                              "&:hover": { bgcolor: "#d32f2f" },
                            }}
                          >
                            <ClearIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            height: 100,
                            width: 150,
                            borderStyle: "dashed",
                            borderColor: "rgba(0, 0, 0, 0.23)",
                            color: "text.secondary",
                            textTransform: "none",
                            borderRadius: 2,
                            flexDirection: "column",
                            gap: 0.5,
                            "& .MuiButton-icon": { m: 0 },
                          }}
                        >
                          Upload Logo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </Button>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Recommended size: 300x100px.
                        <br />
                        PNG, JPG or WEBP formats.
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                {/* Tab 1: Shipping & Tax */}
                {tabValue === 1 && (
                  <Stack spacing={3.5}>
                    <Typography variant="h6" fontWeight={700}>Shipping Charges & Tax Rates</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label={`Standard Tax Rate (%)`}
                          value={formData.taxPercentage}
                          onChange={handleInputChange}
                          name="taxPercentage"
                          required
                          slotProps={{ htmlInput: { min: 0, step: "0.1" } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label={`Base Shipping Charge (${formData.currencySymbol})`}
                          value={formData.shippingCharge}
                          onChange={handleInputChange}
                          name="shippingCharge"
                          required
                          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label={`Threshold for Free Shipping (${formData.currencySymbol})`}
                          value={formData.freeShippingMinimumOrder}
                          onChange={handleInputChange}
                          name="freeShippingMinimumOrder"
                          required
                          helperText="0 to disable free shipping policies"
                          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                        />
                      </Grid>
                    </Grid>

                    <Divider />
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">CUSTOMER ORDER CANCELLATIONS</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.orderSettings.allowCancellation}
                              onChange={(e) => handleNestedChange("orderSettings", "allowCancellation", e.target.checked)}
                              color="success"
                            />
                          }
                          label="Allow Customer Self-Cancellations"
                        />
                      </Grid>
                      {formData.orderSettings.allowCancellation && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Cancellation Hours Window"
                            value={formData.orderSettings.cancellationHours}
                            onChange={(e) => handleNestedChange("orderSettings", "cancellationHours", Number(e.target.value))}
                            required
                            helperText="Time frame (hours) allowed to cancel orders after checkout"
                            slotProps={{ htmlInput: { min: 1 } }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                )}

                {/* Tab 2: Payment Gateways */}
                {tabValue === 2 && (
                  <Stack spacing={3.5}>
                    <Typography variant="h6" fontWeight={700}>Payment Processor Integrations</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.paymentGateway.codEnabled}
                              onChange={(e) => handleNestedChange("paymentGateway", "codEnabled", e.target.checked)}
                              color="success"
                            />
                          }
                          label="Enable Cash on Delivery (COD)"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.paymentGateway.razorpayEnabled}
                              onChange={(e) => handleNestedChange("paymentGateway", "razorpayEnabled", e.target.checked)}
                              color="success"
                            />
                          }
                          label="Enable Razorpay Integration"
                        />
                      </Grid>
                      {formData.paymentGateway.razorpayEnabled && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Razorpay Key ID"
                            value={formData.paymentGateway.razorpayKeyId}
                            onChange={(e) => handleNestedChange("paymentGateway", "razorpayKeyId", e.target.value)}
                            required
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                )}

                {/* Tab 3: SEO & Search */}
                {tabValue === 3 && (
                  <Stack spacing={3.5}>
                    <Typography variant="h6" fontWeight={700}>Search Engine Optimization (SEO)</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Default Meta Title"
                          value={formData.seo.metaTitle}
                          onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
                          placeholder="e.g. Planters Agro Valley | Farm Fresh Supplies"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Default Meta Description"
                          value={formData.seo.metaDescription}
                          onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
                          multiline
                          rows={3}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Meta Keywords (Comma separated)"
                          value={formData.seo.metaKeywords}
                          onChange={(e) => handleNestedChange("seo", "metaKeywords", e.target.value)}
                          placeholder="e.g. plants, organic, soil, fertilizers"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                )}

                {/* Tab 4: Social Connections */}
                {tabValue === 4 && (
                  <Stack spacing={3.5}>
                    <Typography variant="h6" fontWeight={700}>Social Media Profiles</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Facebook Profile URL"
                          value={formData.socialLinks.facebook}
                          onChange={(e) => handleNestedChange("socialLinks", "facebook", e.target.value)}
                          placeholder="https://facebook.com/yourpage"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Instagram Profile URL"
                          value={formData.socialLinks.instagram}
                          onChange={(e) => handleNestedChange("socialLinks", "instagram", e.target.value)}
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Twitter Profile URL"
                          value={formData.socialLinks.twitter}
                          onChange={(e) => handleNestedChange("socialLinks", "twitter", e.target.value)}
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="YouTube Channel URL"
                          value={formData.socialLinks.youtube}
                          onChange={(e) => handleNestedChange("socialLinks", "youtube", e.target.value)}
                          placeholder="https://youtube.com/c/yourchannel"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="LinkedIn Company Page URL"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) => handleNestedChange("socialLinks", "linkedin", e.target.value)}
                          placeholder="https://linkedin.com/company/yourpage"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                )}

                <Divider sx={{ my: 4 }} />
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving}
                    sx={{ px: 4, py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  >
                    {saving ? "Saving Changes..." : "Save Settings"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Settings;
