const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const PORT = 5000;
require("dotenv").config();
const CLIENT_URL = process.env.CLIENT_URL 
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(express.json());
const corsOptions = {
    origin: [`${CLIENT_URL}`,"https://6545bddc3959ee38808de378--fancy-otter-5144aa.netlify.app"], 
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  };
  
  // Enable CORS with the defined options
  app.use(cors(corsOptions));


mongoose
  .connect(`${MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define API routes and controllers 

app.use('/api', require('./router/router')); 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
