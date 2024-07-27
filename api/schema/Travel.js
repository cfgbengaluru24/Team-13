const mongoose = require('mongoose');
require("dotenv").config();

const travelOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    departureTime: {
        type: String,
        required: true,
    },
    arrivalTime: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['bus', 'train', 'flight'], // Ensure type is one of these values
        required: true,
    },
    // Add other relevant fields for travel options
});

const travelSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    commute: [travelOptionSchema], // Array of travel options
});

module.exports = mongoose.model("Travel", travelSchema);