const mongoose = require('mongoose');
require("dotenv").config();

const RequestVolunteerSchema = new mongoose.Schema({

  camp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  
});

module.exports = mongoose.model('RequestVolunteer', RequestVolunteerSchema);
