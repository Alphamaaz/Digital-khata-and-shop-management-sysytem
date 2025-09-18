const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    phone: {
      type: String,
      unique: true,
      match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
    },
    cnic: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    profilePicture: {
      type: String, // Will store the image URL or filename
      default: null, // Optional field
    },

    totalDebt: {
      type: Number,
      default: 0, // Tracks the customer's current debt balance
    },
    totalPayments: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
