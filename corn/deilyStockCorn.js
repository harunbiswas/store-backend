const Stock = require("../models/Stock");
const Store = require("../models/Store"); // Assuming you have a Store model
const moment = require("moment");

const createDailyStock = async () => {
  try {
    const stores = await Store.find(); // Get all stores

    for (const store of stores) {
      // Find the last stock entry for this store
      const lastStock = await Stock.findOne({ store: store._id })
        .sort({ date: -1 })
        .exec();

      const today = moment().startOf("day").toDate();

      // Create new stock based on the previous day's stock
      const newStock = new Stock({
        store: store._id,
        date: today,
        openingBalance: lastStock ? lastStock.openingBalance: 0,
        stockIn: lastStock ? lastStock.items : [], // Carry forward items from the previous stock
       
        wastage: 0,
      });

      await newStock.save();
      console.log(`Daily stock created for store: ${store.name}`);
    }
  } catch (error) {
    console.error("Failed to create daily stock:", error.message);
  }
};

module.exports =createDailyStock;
