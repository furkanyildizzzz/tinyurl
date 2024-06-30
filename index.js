const express = require('express');
const mongoose = require('mongoose');
const memjs = require('memjs');
const { RateLimiterMemory } = require('rate-limiter-flexible');

require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

//Connect to MongoDb
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
    
// Connect to Memcache
const memcacheClient = memjs.Client.create(process.env.MEMCACHIER_SERVERS);

  // Rate limiting middleware
const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 60, // per 60 seconds
  });
  
  app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  });

  app.post("/shorten", async (req,res,next ) => {

    const {url} = req.body;

    console.log("You requested to shorten url ", url)
    return res.send("You requested to shorten url " +  url)
  })

  // Start the server
app.listen(port, () => {
    console.log(process.env.MONGODB_CONNECTION_STRING)
    console.log(`Server is running on port ${port}`);
  });