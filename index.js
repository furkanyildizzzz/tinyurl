const express = require('express');
const mongoose = require('mongoose');
const memjs = require('memjs');
const userRoutes = require('./routes/user');
const urlRoutes = require('./routes/url');
const authenticate = require('./middleware/authorization');
const errorHandling = require('./middleware/errorHandling');
const rateLimiting = require('./middleware/rateLimiting');
const initializeCounter = require('./lib/initializeCounter');

require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

//Connect to MongoDb
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize the counter for short URL sequences
initializeCounter();

// Rate limiting middleware
app.use(rateLimiting);

app.use('/url', authenticate, urlRoutes);
app.use('/user', userRoutes);

// Error handling middleware
app.use(errorHandling);

// Start the server
app.listen(port, () => {
  console.log(process.env.MONGODB_CONNECTION_STRING);
  console.log(`Server is running on port ${port}`);
});
