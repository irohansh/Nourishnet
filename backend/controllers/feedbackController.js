const Feedback = require('../models/Feedback');
const Order = require('../models/Order'); 
const mongoose = require('mongoose');


exports.submitFeedback = async (req, res) => {
    try {
        const { orderId, collectorId, rating, comment } = req.body;

         // Validation
         if (!orderId || !collectorId || !rating || !comment) {
             return res.status(400).json({ success: false, message: 'Missing required feedback fields.' });
         }
         if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(collectorId)) {
              return res.status(400).json({ success: false, message: 'Invalid ID format provided.' });
          }
          const numericRating = parseInt(rating);
          if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
               return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
           }

        const order = await Order.findOne({ _id: orderId, collector: collectorId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found or you are not authorized to give feedback for this order.' });
        }

         const existingFeedback = await Feedback.findOne({ orderId: orderId });
         if (existingFeedback) {
             return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this order.' });
         }

        const feedback = new Feedback({
            orderId,
            collectorId, 
             distributorId: order.distributor, 
            rating: numericRating,
            comment,
            createdAt: new Date(),
        });

        const savedFeedback = await feedback.save();

        // await Order.findByIdAndUpdate(orderId, { feedbackGiven: true, feedbackId: savedFeedback._id });
        res.status(201).json({ success: true, message: 'Feedback submitted successfully.', feedback: savedFeedback });

    } catch (err) {
        console.error("Submit Feedback Error:", err);
        res.status(500).json({ success: false, message: 'Server error submitting feedback.' });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            // .populate('collectorId', 'name') 
             // .populate('distributorId', 'name') 
            .sort({ createdAt: -1 }); 

        res.json({ success: true, feedbacks }); 

    } catch (err) {
        console.error("Get All Feedback Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching feedback.' });
    }
};

exports.getFeedbackForOrder = async (req, res) => {
     try {
         const orderId = req.params.orderId;
          if (!mongoose.Types.ObjectId.isValid(orderId)) {
              return res.status(400).json({ success: false, message: 'Invalid Order ID format.' });
          }

         const feedback = await Feedback.findOne({ orderId: orderId }); 

         if (!feedback) {
             return res.status(404).json({ success: false, message: 'No feedback found for this order.' });
         }

         res.json({ success: true, feedback });

     } catch (err) {
         console.error("Get Feedback for Order Error:", err);
         res.status(500).json({ success: false, message: 'Server error fetching feedback for order.' });
     }
 };