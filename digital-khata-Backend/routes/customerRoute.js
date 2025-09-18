const express = require("express");
const multer = require("multer");
const path = require("path");
const Customer = require("../models/Customer");
require("dotenv").config();


const router = express.Router();

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Create a Customer (with optional profile picture)
router.post(
  "/create",
  (req, res, next) => {
    upload.single("profilePicture")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { name, phone} = req.body;
      const profilePicture =
        req.file && req.file.filename
          ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
          : null;


      const newCustomer = new Customer({
        name,
        phone,
        profilePicture,
      });
      await newCustomer.save();

      res.status(201).json({
        message: "Customer created successfully",
        customer: newCustomer,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        
        return res
          .status(400)
          .json({
            errors: Object.values(error.errors).map((err) => err.message),
          });
          
      }
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        return res
          .status(400)
          .json({ message: `${duplicateField} already exists` });
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);


// ✅ Get All Customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get a Single Customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a Customer (including optional profile picture)
router.put("/update/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, phone, cnic, address } = req.body;
    let updateData = { name, phone, cnic, address };

    // If a new profile picture is uploaded, update it
    if (req.file) {
      updateData.profilePicture = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a Customer
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Clear a customer's total payments
router.put("/clear/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { totalPayments: 0 },
      { new: true } // return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Payments cleared", customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
