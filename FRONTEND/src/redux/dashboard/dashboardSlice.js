import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../api/dashboardApi";

// Fetch Dashboard Data
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const initialState = {
  statistics: {},
  recentOrders: [],
  monthlySales: [],
  topSellingProducts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fulfilled
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data || {};
        state.statistics = data.statistics || {};
        state.recentOrders = data.recentOrders || [];
        state.monthlySales = data.monthlySales || [];
        state.topSellingProducts = data.topSellingProducts || [];
      })

      // Rejected
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;