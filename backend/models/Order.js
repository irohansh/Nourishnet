const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation', 
      required: true,
      index: true
  },
  collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
  },
  distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
  },
  itemCount: {
      type: Number,
      required: [true, 'Number of items requested is required.'],
      min: [1, 'Must request at least 1 item.']
  },
  status: {
      type: String,
      enum: ['placed', 'confirmed', 'picked_up', 'cancelled'], // Example statuses
      default: 'placed'
  },
  orderDate: {
      type: Date,
      default: Date.now
  },
});

module.exports = mongoose.model('Order', orderSchema);