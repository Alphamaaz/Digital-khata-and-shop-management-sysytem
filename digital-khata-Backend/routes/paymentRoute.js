const express = require("express");
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");


const router = express.Router();

// ✅ Record a new payment
router.post("/create", async (req, res) => {
  try {
    const { customerId, amountPaid, billNumber } = req.body;

    if (!customerId || !amountPaid || amountPaid <= 0) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // Get the customer's current debt
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Deduct the payment from the total debt
    const newTotalDebt = Math.max(0, customer.totalDebt - amountPaid);
    
    // Save payment record
    const newPayment = new Payment({
      customerId,
      amountPaid,
      billNumber
    });

    await newPayment.save();

    // Update customer's total debt
    await Customer.findByIdAndUpdate(customerId, {
      totalDebt: newTotalDebt,
      $inc: { totalPayments: amountPaid },
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      payment: newPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("customerId", "name");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get payments by customer ID
router.get("/customer/:customerId", async (req, res) => {
  try {
    
    const payments = await Payment.findById(req.params.id).populate(
      "customerId",
      "name phone"
    );


    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this customer" });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Get a payment by ID

router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      
      "amountPaid paymentDate"
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a payment
router.put("/update/:id", async (req, res) => {
  try {
    const { amountPaid } = req.body;
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const customer = await Customer.findById(payment.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const oldAmountPaid = payment.amountPaid;
    const difference = amountPaid - oldAmountPaid;

    // Update customer debt and total payments
    const updatedDebt = customer.totalDebt + oldAmountPaid - amountPaid;

    await Customer.findByIdAndUpdate(customer._id, {
      totalDebt: updatedDebt,
      $inc: { totalPayments: difference }, // This can be negative if amount decreased
    });

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { amountPaid, remainingDebt: updatedDebt },
      { new: true }
    );

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Delete a payment
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Customer.findByIdAndUpdate(payment.customerId, {
      $inc: {
        totalDebt: payment.amountPaid,
        totalPayments: -payment.amountPaid,
      },
    });

    await Payment.findByIdAndDelete(id);

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
