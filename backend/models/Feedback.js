const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true, 
      index: true
  },
  collectorId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
       index: true
  },
   distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
   },
  rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot be more than 5.']
  },
  comment: {
      type: String,
      required: [true, 'Comment is required.'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters.'] 
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);