const mongoose = require('mongoose');

// Define the schema for the website information
const websiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  mediaLinks: [{
    type: String, 
  }],
  webLinks: [{
    type: String, 
  }],
});

// Create a model based on the schema
const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;


module.exports = Website;
