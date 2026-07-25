import axiosInstance from "./axiosInstance";

/**
 * Get Dashboard Statistics
 */
export const getDashboard = async () => {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data;
};