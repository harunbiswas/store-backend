const express = require("express");

const authGuard = require("../middleware/authGuard");
const stockController = require("../controller/stockController");

const router = express.Router();

// Route to create a daily stock for a store
router.post("/daily",authGuard, stockController.createDailyStock );

// Route to get all stocks
router.get("/", authGuard,  stockController.getAllStocks);

// Route to get stock by store ID
router.get("/:storeId",authGuard,  stockController.getStockByStoreId);

// Route to update stock
router.put("/:id",authGuard,  stockController.updateStock);

// Route to delete stock
router.delete("/:id",authGuard,  stockController.deleteStock);

module.exports = router;
