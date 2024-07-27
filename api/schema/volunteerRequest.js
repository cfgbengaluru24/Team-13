const mongoose = require('mongoose');
require("dotenv").config();

const VolunteerRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rg',
        required: true,
        validate: {
          validator: async function(value) {
            const user = await mongoose.model('Rg').findById(value);
            return user && user.selectedOption === 'trainer';
          },
          message: 'User must have a trainer role'
        }
      

  },
  camp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VolunteerRequest', VolunteerRequestSchema);
