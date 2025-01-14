const Sale = require('./../models/Sale'); // Import the Sale model
const Product = require('../models/Product'); // Import the Product model (if needed for additional product info)
const Stock = require('../models/Stock'); // Stock model

// Create a new sale
exports.createSale = async (req, res) => {
    try {
      const { storeId, productId, quantity, discount, cash, paymentType } = req.body;
  
      // Find the product to ensure it exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Find the stock entry for this store and today's date
      let stock = await Stock.findOne({
        store: storeId,
        date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Find stock for today
      });
  
      // If no stock exists for today, create a new stock entry
      if (!stock) {
        stock = new Stock({
          store: storeId,
          date: new Date(),
          openingBalance: 0,
          stockIn: [],
          wastageOrSelfConsumption: 0,
        });
        await stock.save();
      }
  
      // Find the product in the stockIn array
      const stockItem = stock.stockIn.find(
        (item) => item.productId.toString() === productId.toString()
      );
  
      if (!stockItem || stockItem.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
  
      // Calculate the total price before discount
      const totalBeforeDiscount = product.price * quantity;
  
      // Apply discount if provided
      const discountAmount = (discount / 100) * totalBeforeDiscount;
      const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  
      // Create the sale record
      const newSale = new Sale({
        storeId,
        productId,
        quantity,
        discount,
        cash,
        paymentType,
      });
  
      // Save the sale to the database
      const sale = await newSale.save();
  
      // Reduce the stock quantity in the stockIn array
      stockItem.quantity -= quantity;
      await stock.save();
  
      // Respond with the created sale and the calculated totals
      return res.status(201).json({
        message: 'Sale created successfully',
        sale,
        totalBeforeDiscount,
        discountAmount,
        totalAfterDiscount,
        updatedStock: stockItem.quantity, // Updated stock quantity after sale
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId'); // Populate productId to get product details
    return res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific sale by ID
exports.getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findById(id).populate('productId');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    return res.status(200).json(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a sale (e.g., change payment type or quantity)
exports.updateSale = async (req, res) => {
  const { id } = req.params;
  const { quantity, discount, paymentType } = req.body;

  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Recalculate totals based on new quantity or discount
    const product = await Product.findById(sale.productId);
    const totalBeforeDiscount = product.price * quantity;
    const discountAmount = (discount / 100) * totalBeforeDiscount;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;

    // Update sale record
    sale.quantity = quantity || sale.quantity;
    sale.discount = discount || sale.discount;
    sale.paymentType = paymentType || sale.paymentType;

    const updatedSale = await sale.save();

    return res.status(200).json({
      message: 'Sale updated successfully',
      updatedSale,
      totalBeforeDiscount,
      discountAmount,
      totalAfterDiscount,
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    await sale.remove();
    return res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};







// Helper function to get date range for today
const getStartAndEndOfDay = (date) => {
  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(date.setHours(23, 59, 59, 999));
  return { start, end };
};

// Get sales statistics under a specific store
exports.getSalesStatisticsByStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    if (!storeId) {
      return res.status(400).json({ message: 'storeId is required' });
    }

    const now = new Date();

    // Today
    const { start: todayStart, end: todayEnd } = getStartAndEndOfDay(new Date());
    const todaySales = await Sale.find({
      storeId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Yesterday
    const { start: yesterdayStart, end: yesterdayEnd } = getStartAndEndOfDay(new Date(now.setDate(now.getDate() - 1)));
    const yesterdaySales = await Sale.find({
      storeId,
      createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });

    // This Month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthSales = await Sale.find({
      storeId,
      createdAt: { $gte: monthStart },
    });

    // Total Sales
    const totalSales = await Sale.find({ storeId });

    // Aggregate statistics
    const calculateTotalAmount = (sales) =>
      sales.reduce((total, sale) => {
        const cash = sale.cash;
       
        return total + cash;
      }, 0);

      const statistics = [
        {
          title: "Today",
          count: todaySales.length,
          totalAmount: calculateTotalAmount(todaySales),
        },
        {
          title: "Yesterday",
          count: yesterdaySales.length,
          totalAmount: calculateTotalAmount(yesterdaySales),
        },
        {
          title: "This Month",
          count: thisMonthSales.length,
          totalAmount: calculateTotalAmount(thisMonthSales),
        },
        {
          title: "Total",
          count: totalSales.length,
          totalAmount: calculateTotalAmount(totalSales),
        },
      ];
      

    return res.status(200).json(statistics);
  } catch (error) {
    console.error('Error fetching sales statistics:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

