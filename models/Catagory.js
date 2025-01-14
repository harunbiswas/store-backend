const mongoose = require('mongoose');

// Define the schema for categories
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    }
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);




const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
