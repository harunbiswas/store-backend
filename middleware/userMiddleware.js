const { check, validationResult } = require('express-validator');
const User = require('../models/User');


const registerValidation = [
    // Validate username
    check('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .custom(async (username) => {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          // Throw a validation error if the user already exists
          throw new Error('User already exists');
        }
        return true; // If the user does not exist, proceed
      }),
  
    // Validate email and check if it already exists
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // Throw a validation error if the user already exists
          throw new Error('User already exists');
        }
        return true; // If the email does not exist, proceed
      }),
  
    // Validate password
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
  
  const editValidation = [
    // Validate username
    check('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
      
  
    // Validate email and check if it already exists
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
  ];


  const loginValidatin=[
    check('username')
    .isLength({ min: 3 })
    .withMessage('Username or email is required'),

    check("password")
    .isLength({ min: 3 })
    .withMessage('password is required')
  ]



  const allValidationResult = async(req, res, next)=>{
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if(Object.keys(mappedErrors).length === 0){
        next()
    }else{
        res.status(401).json(mappedErrors)
    }
  }
    


  module.exports ={registerValidation, loginValidatin, allValidationResult, editValidation}


