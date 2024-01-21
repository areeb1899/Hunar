const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    date: Number,
    price: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { versionKey: false, timestamps: true });

const Listing = mongoose.model('listing', listingSchema);

module.exports = Listing;