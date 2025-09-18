const express = require("express");
const Purchase = require("../models/Purchase");
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");

const router = express.Router();

router.get("/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    // Fetch purchases and payments for the customer
    const purchases = await Purchase.find({ customerId }).lean();
    const payments = await Payment.find({ customerId }).lean();
    const customer = await Customer.findById(customerId).lean(); // Fetch customer details

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Format purchases
    const formattedPurchases = purchases.map((p) => ({
      _id: p._id,
      customerId: p.customerId,
      type: "purchase",
      products: p.products, // List of purchased products
      totalAmount: p.totalAmount,
      amountPaid: p.amountPaid,
      remainingBalance: p.remainingBalance,
      billNumber: p.billNumber,
      date: p.purchaseDate, // Purchase date
    }));

    // Format payments
    const formattedPayments = payments.map((p) => ({
      _id: p._id,
      customerId: p.customerId,
      type: "payment",
      amountPaid: p.amountPaid, // Payment amount
      billNumber: p.billNumber,
      date: p.paymentDate, // Payment date
    }));

    // Prepare the final response
    const response = {
      customer: {
        _id: customer._id,
        name: customer.name,
        profilePicture: customer.profilePicture || null,
        totalPayments : customer.totalPayments,
        totalDebt: customer.totalDebt,
        date: customer.registrationDate,
      },
      transactions: [...formattedPurchases, ...formattedPayments].sort(
        (a, b) => new Date(b.date) - new Date(a.date) // Latest first
      ),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

module.exports = router;
