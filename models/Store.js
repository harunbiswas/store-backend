const mongoose = require('mongoose');

// Define the schema for the Store
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  employees: [
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing User model
        ref: 'User', // Reference the User model
        required: true,
      },
    },
  ],
});

// Create the model from the schema
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
