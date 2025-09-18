require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productsAuth");
const customerRoutes = require("./routes/customerRoute");
const purchaseRoutes = require("./routes/purchaseRoute");
const paymentRoutes = require("./routes/paymentRoute");
const transactionRoutes = require("./routes/transactionRoute");
const dashboardRoute = require("./routes/dashboard")
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;




// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/customers",customerRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/dashboard",dashboardRoute)


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
