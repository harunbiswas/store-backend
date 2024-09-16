const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerController, loginController } = require('../controller/userController');
const { registerValidation, validationResult, allValidationResult, loginValidatin } = require('../middleware/userMiddleware');

const router = express.Router();

// User Registration
router.post('/register', registerValidation, allValidationResult, registerController);

// User Login
router.post('/login',loginValidatin ,allValidationResult, loginController);

module.exports = router;
