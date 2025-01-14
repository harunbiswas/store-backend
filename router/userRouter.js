const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerController, loginController, getAllUsersController, getSingleUserController, editUserController } = require('../controller/userController');
const { registerValidation, validationResult, allValidationResult, loginValidatin, editValidation } = require('../middleware/userMiddleware');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

// User Registration
router.post('/register', registerValidation, allValidationResult, registerController);

// User Login
router.post('/login',loginValidatin ,allValidationResult, loginController);

// get all user
router.get('/users',authGuard, getAllUsersController )
router.get('/user/:id',authGuard, getSingleUserController )
router.put('/user/:id',authGuard, editValidation,allValidationResult, editUserController )


module.exports = router;
