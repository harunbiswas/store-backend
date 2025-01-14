const express = require('express')
const authGuard = require('../middleware/authGuard')

const {addCatagoryController, getCatagoryController } = require('../controller/catagoryController')
const {  createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct, } = require('../controller/productController')


const router = express.Router()

// catagory
router.post('/catagory', authGuard, addCatagoryController)
router.get('/catagory', authGuard, getCatagoryController)


// product

// Routes for products
router.post("/", authGuard, createProduct);         // Create a new product
router.get("/",authGuard, getProducts);           // Get all products
router.get("/:id",authGuard, getProductById);     // Get a product by ID
router.put("/:id",authGuard, updateProduct);      // Update a product by ID
router.delete("/:id",authGuard, deleteProduct);   // Delete a product by ID


module.exports = router