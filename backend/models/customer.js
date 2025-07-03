const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food' 
    }],
    // Stripe payment details
    stripeCustomerId: { type: String },
    cardLast4: { type: String },
    cardBrand: { type: String },
    cardExpMonth: { type: String },
    cardExpYear: { type: String }
});

module.exports = mongoose.model('Customer', customerSchema);
