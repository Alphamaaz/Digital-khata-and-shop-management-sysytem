const express = require("express");
const Purchase = require("../models/Purchase");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");
const Products = require("../models/Products");
const router = express.Router();

// ✅ Create a new purchase
router.post("/create", async (req, res) => {
  try {
    const { customerId, products, amountPaid,billNumber } = req.body;

    if (!customerId || !products || products.length === 0) {
      return res.status(400).json({ message: "Invalid purchase data" });
    }

    // Calculate total purchase amount
    const totalAmount = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const remainingBalance = totalAmount - amountPaid;

    // Create new purchase record
    const newPurchase = new Purchase({
      customerId,
      billNumber,
      products,
      totalAmount,
      amountPaid,
      remainingBalance,
    });

    // Save purchase to database
    await newPurchase.save();

    for (const p of products) {
      const product = await Products.findById(p.productId);

      if (!product) continue;

      // Ensure stock won't go negative
      const newStock = product.stock - p.quantity;
      if (newStock < 0) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      await Products.findByIdAndUpdate(p.productId, {
        $inc: { stock: -p.quantity },
      });
    }
    

    // Update customer's total debt
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalDebt: remainingBalance,
        totalPayments : amountPaid
       },

    });

    res.status(201).json({
      message: "Purchase recorded successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().populate(
      "customerId",
      "name phone"
    );
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID format" });
    }

    // Convert to ObjectId properly
    const objectId = new mongoose.Types.ObjectId(customerId);

    const purchases = await Purchase.find({ customerId: objectId }).populate(
      "customerId",
      "name totalDebt"
    );

    if (!purchases.length) {
      return res
        .status(404)
        .json({ message: "No purchases found for this customer" });
    }

    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get a purchase by ID

router.get("/:id", async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return res.status(400).json({ message: "Invalid purchase ID format" });
    }

    const purchase = await Purchase.findById(purchaseId)
      .populate("customerId", "name")
      .populate("products.productId", "name sellPrice purchasePrice unit") // 👈 add this
      .select(
        "products totalAmount amountPaid remainingBalance purchaseDate billNumber"
      );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update a purchase
router.put("/update/:id", async (req, res) => {
  try {
    const { products, amountPaid } = req.body;
    const purchaseId = req.params.id;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const oldAmountPaid = purchase.amountPaid;
    const oldRemainingBalance = purchase.remainingBalance;

    // Calculate new totals
    const totalAmount = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const remainingBalance = totalAmount - amountPaid;

    // Update purchase
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      { products, totalAmount, amountPaid, remainingBalance },
      { new: true }
    );

    // Update Customer's debt and payments
    const customerId = purchase.customerId;
    const paymentDiff = amountPaid - oldAmountPaid;
    const balanceDiff = remainingBalance - oldRemainingBalance;

    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalPayments: paymentDiff,
        totalDebt: balanceDiff,
      },
    });

    res.status(200).json({
      message: "Purchase updated successfully",
      purchase: updatedPurchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Delete a purchase
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const { customerId, remainingBalance, amountPaid } = deletedPurchase;

    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalDebt: -remainingBalance,
        totalPayments: -amountPaid,
      },
    });

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
