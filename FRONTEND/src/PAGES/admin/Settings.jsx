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
} from "@mui/material";
import {
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  Share as SocialsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";

const Settings = () => {

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
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
      pinterest: "",
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
          socialLinks: s.socialLinks || { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "", pinterest: "" },
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
    let finalValue = value;
    if (name === "storePhone") {
      finalValue = value.replace(/\D/g, "");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
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
    if (formData.storePhone && !/^\d{10,15}$/.test(formData.storePhone)) {
      return toast.error("Please enter a valid store phone number (10 to 15 digits)");
    }
    try {
      setSaving(true);
      const data = new FormData();
      data.append("storeName", formData.storeName);
      data.append("storeEmail", formData.storeEmail);
      data.append("storePhone", formData.storePhone);

      // Append stringified nested fields
      data.append("address", JSON.stringify(formData.address));
      data.append("socialLinks", JSON.stringify(formData.socialLinks));

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
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={800} sx={{ color: "success.main", mb: 0.5 }}>
          Store Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Configure system configurations, payment processors, tax schedules, shipping policies, and search parameters
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left panel: Tabs selector */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
              <Tabs
                orientation="horizontal"
                variant="scrollable"
                scrollButtons="auto"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderRight: 0,
                  "& .MuiTabs-indicator": { bgcolor: "success.main" },
                  "& .MuiTab-root": {
                    alignItems: "center",
                    textAlign: "center",
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
                <Tab icon={<SocialsIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Social Connections" />
              </Tabs>
            </Card>
          </Grid>

          {/* Right panel: Content forms */}
          <Grid item xs={12}>
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
                          error={formData.storePhone !== "" && !/^\d{10,15}$/.test(formData.storePhone)}
                          helperText={formData.storePhone !== "" && !/^\d{10,15}$/.test(formData.storePhone) ? "Phone number must be between 10 and 15 digits" : ""}
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

                {/* Tab 1: Social Connections */}
                {tabValue === 1 && (
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
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="LinkedIn Company Page URL"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) => handleNestedChange("socialLinks", "linkedin", e.target.value)}
                          placeholder="https://linkedin.com/company/yourpage"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Pinterest Profile URL"
                          value={formData.socialLinks.pinterest || ""}
                          onChange={(e) => handleNestedChange("socialLinks", "pinterest", e.target.value)}
                          placeholder="https://pinterest.com/yourprofile"
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
