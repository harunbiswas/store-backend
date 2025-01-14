const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');


const registerController = async (req, res) => {
   
  
    try {
  
      // Create a new user
     const user = new User(req.body);
  
      // Save the user to the database
     const result= await user.save();
      
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
        expiresIn: '8640h',
      });
  
      const newuser = _.omit(user.toObject(), ['password']);


      res.status(200).json({ token, newuser });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Server error' });
    }
  }


  const loginController =async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({
        $or: [
          { email:username },
          { username }
        ]
      });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
         // Create a JWT token
         const token = jwt.sign({_id: user._id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt }, process.env.jwt_secret, {
            expiresIn: '8640h',
          });
  
          const newuser = _.omit(user.toObject(), ['password']);


      res.status(200).json({ token, newuser });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Server error' });
    }
  }


  const getAllUsersController = async (req, res) => {
   
    try {
      // Check if the authenticated user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' }); // Forbidden
      }
  
      // Fetch all users, omitting passwords for security
      const users = await User.find().select('-password');
  
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getSingleUserController = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Fetch the user by ID, omitting the password for security
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Not Found
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
  
      // Handle invalid ObjectId errors (Mongoose validation)
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID' }); // Bad Request
      }
  
      res.status(500).json({ message: 'Server error' });
    }
  };


  const editUserController = async (req, res) => {
    try {
      const userId = req.params.id; // Get user ID from request parameters
      const updateData = req.body; // Get updated data from request body
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user details
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData }, // Set new data
        { new: true, runValidators: true } // Return updated document and apply validations
      ).select('-password'); // Exclude the password from the response
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
  
      // Handle invalid ObjectId errors
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  


  module.exports = {registerController, loginController, getAllUsersController, getSingleUserController, editUserController}