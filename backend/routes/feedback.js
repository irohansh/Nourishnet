const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// const { protect } = require('../middleware/authMiddleware'); 

router.get('/all', feedbackController.getAllFeedback);

router.post('/submit', /* protect, authorizeCollector, */ feedbackController.submitFeedback);

router.get('/order/:orderId', feedbackController.getFeedbackForOrder);


module.exports = router;