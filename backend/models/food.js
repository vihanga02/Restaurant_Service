const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category1: { type: String },
    category2: { type: String },
    imageUrl: { type: String }, 
    starRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        stars: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
      }
    ]
  });

module.exports = mongoose.model('Food', foodSchema);