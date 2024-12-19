const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  foodItems: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  orderedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
