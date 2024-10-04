const express = require('express')
const env = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./router/userRouter')
const movieRoutes = require('./router/movieRouter')



env.config()
const PORT = process.env.PORT || 3000;
const app = express()
app.use(bodyParser.json())




const corsOptions = {
  origin: '*', 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.get('/', async(req, res)=> {
    res.status(200).json("welcome to my Application.")
  })

  app.use('/user',userRoutes )
  app.use('/movie',movieRoutes )


 

  // Error-handling middleware
  app.use((err, req, res, next) => {
    const statusCode = err.status || 500; // Use the status code from the error, or default to 500
    res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
    });
  });

  // not found handler
  app.use((req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: 'Route Not Found',
    });
  });


app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})