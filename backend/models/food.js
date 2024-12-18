const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category1: { type: String },
    category2: { type: String },
    imageUrl: { type: String }, 
  });

module.exports = mongoose.model('Food', foodSchema);