const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    imageUrl: { type: String }, 
  });

module.exports = mongoose.model('Food', foodSchema);