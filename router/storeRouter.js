const express = require('express')
const storeController = require('../controller/storeController');
const authGuard = require('../middleware/authGuard');

const router = express.Router()

// Store routes
router.post('/',authGuard, storeController.createStore);
router.get('/',authGuard, storeController.getAllStores);
router.get('/:id',authGuard, storeController.getStoreById);
router.get('/user/:id',authGuard, storeController.getStoreByUserId);
router.put('/:id',authGuard, storeController.updateStore);
router.delete('/:id',authGuard, storeController.deleteStore);

module.exports = router