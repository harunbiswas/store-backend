const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store", // Reference to Store model
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    openingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    stockIn: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
          default: 0,
        },
      },
    ],
    wastageOrSelfConsumption: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create a virtual field to get the store's name dynamically
StockSchema.virtual('storeName').get(function() {
  return this.store ? this.store.name : ''; // Assuming Store has a "name" field
});

module.exports = mongoose.model("Stock", StockSchema);
