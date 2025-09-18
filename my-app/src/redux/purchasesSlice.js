import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { fetchCustomers } from './customersSlice';


// 🔹 Fetch purchases based on customer ID
export const fetchCustomerPurchases = createAsyncThunk(
  "purchases/fetchCustomerPurchases",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/purchases/customer/${customerId}`
      );
      return response.data; // API should return an array of purchases
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Delete purchase from API and Redux store
export const deletePurchase = createAsyncThunk(
  "purchases/deletePurchase",
  async (purchaseId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/purchases/delete/${purchaseId}`);
      dispatch(fetchCustomers())
      return purchaseId; // Return deleted purchase ID
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const purchasesSlice = createSlice({
  name: "purchases",
  initialState: {
    purchases: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {}, // No local reducers needed

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchases = action.payload; // Store fetched purchases
      })
      .addCase(fetchCustomerPurchases.rejected, (state, action) => {
        state.status = "failed";
        state.error = "purchases not fornd";
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default purchasesSlice.reducer;
