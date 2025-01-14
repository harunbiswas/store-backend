const express = require('express')
const storeController = require('../controller/storeController');
const authGuard = require('../middleware/authGuard');
const { createSale, getAllSales, getSaleById, updateSale, deleteSale, getSalesStatistics, getSalesStatisticsByStore } = require('../controller/saleController');

const router = express.Router()

// Store routes
router.post('/',authGuard, createSale);
router.get('/',authGuard, getAllSales);
router.get('/:id',authGuard, getSaleById);

router.put('/:id',authGuard, updateSale);
router.delete('/:id',authGuard, deleteSale);

router.get('/statistics/:storeId', authGuard, getSalesStatisticsByStore);

module.exports = router 