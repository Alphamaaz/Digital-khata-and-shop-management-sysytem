const express = require("express");
const Product = require("../models/Products");

const router = express.Router();

// ✅ Create a Product
router.post("/create", async (req, res) => {
  try {
    const { name,  sellPrice, purchasePrice,stock, unit } = req.body;

    const newProduct = new Product({
      name,
      sellPrice,
      purchasePrice,
      stock,
      unit,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a Product by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { name,  sellPrice, purchasePrice,stock, unit } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name,  sellPrice, purchasePrice,stock, unit },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a Product by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
