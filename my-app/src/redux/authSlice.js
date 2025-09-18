import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem("token");

let isAuthenticated = false;

if (token) {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp > now) {
      isAuthenticated = true;
    } else {
      localStorage.removeItem("token"); // Remove expired token
    }
  } catch (error) {
    localStorage.removeItem("token"); // Corrupted token
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
