const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Assuming you have a Product model
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store', // Assuming you have a Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    cash: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,   
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Sale model
const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
