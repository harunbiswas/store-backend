const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'supervisior', 'inputter'], // Example roles
    default: 'editor', // Default role
  }
}, {
    timestamps: true // Enables `createdAt` and `updatedAt` fields
  });

// Before saving the user, hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
