const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
// const { protect } = require('../middleware/authMiddleware');

router.get('/active', donationController.getActiveDonations);

router.get('/:id', donationController.getDonation);

router.post('/add', /* protect, */ donationController.addDonation);

router.post('/order', /* protect, */ donationController.placeOrder);

router.put('/:id', /* protect, authorizeOwner, */ donationController.updateDonation);

router.delete('/:id', /* protect, authorizeOwner, */ donationController.deleteDonation);

module.exports = router;