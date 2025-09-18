const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
  
    sellPrice: {
      type: Number,
      required: true,
      min: [0.01, "Sell price must be greater than zero"],
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: [0.01, "Purchase price must be greater than zero"],
    },
    stock: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // ✅ Adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Product", productsSchema);
