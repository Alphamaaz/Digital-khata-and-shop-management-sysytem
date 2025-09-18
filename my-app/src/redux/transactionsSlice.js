import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";

export const fetchCustomerTransactions = createAsyncThunk(
  "transactions/fetchCustomerTransactions",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction/${customerId}`);
      // console.log("API Response:", response.data);

      if (!response.data || !Array.isArray(response.data.transactions)) {
        throw new Error("Invalid data format");
      }

      return response.data; // Return full object { customer, transactions }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],  // Ensure it's an array
    customer: null,    // Store customer info separately
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload.transactions; // Extract transactions array
        state.customer = action.payload.customer; // Save customer details separately
      })
      .addCase(fetchCustomerTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});



export default transactionsSlice.reducer;
