const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amountPaid: { type: Number, required: true },
  
  billNumber: {
    type: String,
    unique: true, 
    required: true,
  },
  
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
