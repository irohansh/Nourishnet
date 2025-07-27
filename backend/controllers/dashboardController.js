const Donation = require('../models/Donation');
const Order = require('../models/Order');
// const User = require('../models/User');
// const Feedback = require('../models/Feedback');
exports.getDistributorDashboard = async (req, res) => {
    try {
        const distributorId = req.params.id;
        if (!distributorId) {
            return res.status(400).json({ success: false, message: 'Distributor ID is required.' });
        }
        const activeDonations = await Donation.find({
            distributor: distributorId,
            useBy: { $gt: new Date() },
            quantity: { $gt: 0 } 
        }).sort({ useBy: 1 });

        const orderHistory = await Order.find({ distributor: distributorId })
            .sort({ orderDate: -1 });

        res.json({ success: true, activeDonations, orderHistory }); 

    } catch (err) {
        console.error("Distributor Dashboard Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching distributor dashboard data.' });
    }
};

exports.getCollectorDashboard = async (req, res) => {
    try {
        const collectorId = req.params.id;
         if (!collectorId) {
             return res.status(400).json({ success: false, message: 'Collector ID is required.' });
         }

        const availableDonations = await Donation.find({
            useBy: { $gt: new Date() },
            quantity: { $gt: 0 }
        }).sort({ createdAt: -1 }); 

        const orderHistory = await Order.find({ collector: collectorId })
            .sort({ orderDate: -1 });


        res.json({ success: true, availableDonations, orderHistory });

    } catch (err) {
        console.error("Collector Dashboard Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching collector dashboard data.' });
    }
};