const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');


const registerController = async (req, res) => {
    const { username, email, password } = req.body;
  
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


  module.exports = {registerController, loginController}