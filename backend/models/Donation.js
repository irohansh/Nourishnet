const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Link to the User model (distributor)
  distributor: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User', // Reference the 'User' model
       required: true,
       index: true // Index for faster lookups by distributor
  },
  foodType: {
      type: String,
      required: [true, 'Food type/description is required.'],
      trim: true
  },
  allergy: {
      type: String,
      required: [true, 'Allergy information is required (enter "None" if applicable).'],
      trim: true
  },
  quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [0, 'Quantity cannot be negative.'] // Can be 0 if all taken
  },
  location: {
      type: String,
      required: [true, 'Pickup location is required.'],
      trim: true
  },
  pickupTime: {
      type: String,
      required: [true, 'Pickup timing is required.'],
      trim: true
  },
  useBy: {
      type: Date,
      required: [true, 'Use-by date and time are required.'],
      index: true 
  },
  foodImage: {
      type: String, 
      required: [true, 'Food image is required.']
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
});


module.exports = mongoose.model('Donation', donationSchema);