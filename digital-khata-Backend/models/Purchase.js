const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  billNumber: {
    type: String,
    unique: true, // ensure no duplicates
    required: true,
  },
  products: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }
],

  totalAmount: { type: Number, required: true }, // Sum of all products
  amountPaid: { type: Number}, // Payment at time of purchase
  remainingBalance: { type: Number, required: true }, // Debt after payment
  purchaseDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
