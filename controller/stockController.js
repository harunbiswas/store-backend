const Stock = require("../models/Stock");
const moment = require('moment');



// Get all stock entries
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate("stockIn.productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock data", details: error.message });
  }
};


exports.getStockByStoreId = async (req, res) => {
  try {
   
    // Get today's date in the required format (e.g., 'YYYY-MM-DD')
    const today = moment().startOf('day'); // Start of today to match records accurately

    // Get stock records for a specific store and today's date
    const stock = await Stock.find({
        store: req.params.storeId,
        date: { $gte: today } // Filter by today's date or later
      })
      .populate("store") // Populate store data
      .populate("stockIn.productId", "name price category");

    if (!stock || stock.length === 0) {
      return res.status(404).json({ error: "No stock found for this store today" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock", details: error.message });
  }
};

  



// Create or Clone Stock for Today

exports.createDailyStock = async (req, res) => {
  try {
    const { storeName } = req.body;

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for comparison

    // Check if today's stock already exists for the store
    const existingStock = await Stock.findOne({ storeName, date: today });

    if (existingStock) {
      return res.status(400).json({ error: "Stock for today already exists" });
    }

    // Find the latest stock entry for the store (yesterday or the most recent day)
    const previousStock = await Stock.findOne({ storeName })
      .sort({ date: -1 }) // Get the most recent stock entry
      .exec();

    if (!previousStock) {
      return res.status(404).json({ error: "No previous stock data found for this store" });
    }

    // Create today's stock based on previous day's data
    const newStock = new Stock({
      storeName,
      date: today,
      openingBalance: previousStock.openingBalance, // Use the previous day's opening balance
      stockIn: previousStock.stockIn, // Clone stockIn from the previous day
      wastageOrSelfConsumption: 0, // Default to 0
    });

    const savedStock = await newStock.save();

    res.status(201).json(savedStock);
  } catch (error) {
    res.status(500).json({ error: "Error creating daily stock", details: error.message });
  }
};


// Update a stock entry
exports.updateStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const { stockIn, openingBalance, wastageOrSelfConsumption } = req.body;

    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
      
     
        stockIn,
        openingBalance,
        wastageOrSelfConsumption,
      },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    res.status(400).json({ error: "Error updating stock entry", details: error.message });
  }
};

// Delete a stock entry
exports.deleteStock = async (req, res) => {
  try {
    const stockId = req.params.id;

    const deletedStock = await Stock.findByIdAndDelete(stockId);

    if (!deletedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stock entry", details: error.message });
  }
};
