const express = require('express');
const env = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./router/userRouter');
const movieRoutes = require('./router/movieRouter');
const productRoutes = require('./router/productRouter');
const storeRoutes = require('./router/storeRouter');
const stockRoutes = require('./router/stockRouter');
const saleRoutes = require('./router/saleRouter');

const cron = require("node-cron");
const createDailyStock = require('./corn/deilyStockCorn');

env.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: '*', 
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', async (req, res) => {
  res.status(200).json("Welcome to my Application.");
});

app.use('/user', userRoutes);
app.use('/movie', movieRoutes);
app.use('/product', productRoutes);
app.use('/store', storeRoutes);
app.use('/stock', stockRoutes);
app.use('/sale', saleRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500; // Use the status code from the error, or default to 500
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Schedule the cron job to run at midnight every day
cron.schedule("43 1 * * *", async () => {
  console.log("Running daily stock creation job...");
  await createDailyStock(); // Execute the function here, not just reference it
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
