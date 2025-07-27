const Donation = require('../models/Donation');
const Order = require('../models/Order');
const mongoose = require('mongoose');

exports.addDonation = async (req, res) => {
    try {
        const { distributor, foodType, allergy, quantity, location, pickupTime, useBy } = req.body;

         if (!distributor || !foodType || !allergy || !quantity || !location || !pickupTime || !useBy || !req.file) {
             return res.status(400).json({ success: false, message: 'Missing required fields or image.' });
         }
         const useByDate = new Date(useBy);
         if (isNaN(useByDate) || useByDate <= new Date()) {
             return res.status(400).json({ success: false, message: 'Use-By date must be a valid future date.' });
         }
          if (parseInt(quantity) <= 0) {
             return res.status(400).json({ success: false, message: 'Quantity must be greater than zero.' });
         }


        let foodImageUrl = '';
        if (req.file) {
            foodImageUrl = `/uploads/${req.file.filename}`;
            console.log("Image saved at:", foodImageUrl);
        } else {
             return res.status(400).json({ success: false, message: 'Food image is required.' });
        }

        const donation = new Donation({
            distributor, 
            foodType,
            allergy,
            quantity: parseInt(quantity),
            location,
            pickupTime,
            useBy: useByDate,
            foodImage: foodImageUrl,
            createdAt: new Date(),
        });

        const savedDonation = await donation.save();
        res.status(201).json({ success: true, donation: savedDonation });

    } catch (err) {
        console.error("Add Donation Error:", err);
         if (err.name === 'ValidationError') {
             return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
         }
        res.status(500).json({ success: false, message: 'Server error adding donation.' });
    }
};

exports.getDonation = async (req, res) => {
    try {
        const donationId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(donationId)) {
            return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
        }

        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }

        res.json({ success: true, donation });

    } catch (err) {
        console.error("Get Donation Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching donation.' });
    }
};

exports.placeOrder = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const { donationId, itemCount, collector } = req.body;
        const quantityRequested = parseInt(itemCount);

         if (!mongoose.Types.ObjectId.isValid(donationId) || !mongoose.Types.ObjectId.isValid(collector)) {
             return res.status(400).json({ success: false, message: 'Invalid ID format.' });
         }
         if (isNaN(quantityRequested) || quantityRequested <= 0) {
             return res.status(400).json({ success: false, message: 'Invalid item count requested.' });
         }

        // const donation = await Donation.findById(donationId).session(session);
         const donation = await Donation.findById(donationId);

        if (!donation) {
             // await session.abortTransaction(); session.endSession();
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }

        if (donation.useBy <= new Date()) {
             // await session.abortTransaction(); session.endSession();
            return res.status(400).json({ success: false, message: 'This donation has expired.' });
        }

        if (donation.quantity < quantityRequested) {
             // await session.abortTransaction(); session.endSession();
            return res.status(400).json({ success: false, message: `Not enough servings available. Only ${donation.quantity} left.` });
        }

        const order = new Order({
            donationId,
            collector, 
            distributor: donation.distributor, 
            itemCount: quantityRequested,
            status: 'placed', 
            orderDate: new Date(),
        });

        // const savedOrder = await order.save({ session });
         const savedOrder = await order.save();

         const updatedDonation = await Donation.findByIdAndUpdate(
             donationId,
             { $inc: { quantity: -quantityRequested } }, 
             { new: true } 
             // { session }
         );


         if (!updatedDonation) {
             // await session.abortTransaction(); session.endSession();
             await Order.findByIdAndDelete(savedOrder._id);
             console.error(`Failed to update donation quantity for ID: ${donationId} after order ${savedOrder._id}`);
             return res.status(500).json({ success: false, message: 'Failed to update donation quantity.' });
         }

        // await session.commitTransaction();
        // session.endSession();

        res.status(201).json({
             success: true,
             message: 'Order placed successfully.',
             orderId: savedOrder._id,
             updatedDonation: { 
                 _id: updatedDonation._id,
                 quantity: updatedDonation.quantity
             }
         });

    } catch (err) {
        // await session.abortTransaction();
        // session.endSession();
        console.error("Place Order Error:", err);
        res.status(500).json({ success: false, message: 'Server error placing order.' });
    }
};

exports.getActiveDonations = async (req, res) => {
    try {
        const activeDonations = await Donation.find({
            useBy: { $gt: new Date() },
             quantity: { $gt: 0 } 
        }).sort({ createdAt: -1 }); 

        res.json({ success: true, donations: activeDonations });

    } catch (err) {
        console.error("Get Active Donations Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching active donations.' });
    }
};

exports.updateDonation = async (req, res) => {
     try {
         const donationId = req.params.id;
         const updates = req.body; 
         delete updates.distributor;
         delete updates.createdAt;
         delete updates.foodImage; 

         if (!mongoose.Types.ObjectId.isValid(donationId)) {
             return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
         }
         const updatedDonation = await Donation.findByIdAndUpdate(donationId, updates, { new: true, runValidators: true });
         if (!updatedDonation) {
             return res.status(404).json({ success: false, message: 'Donation not found or could not be updated.' });
         }
         res.json({ success: true, message: 'Donation updated successfully.', donation: updatedDonation });

     } catch (err) {
         console.error("Update Donation Error:", err);
          if (err.name === 'ValidationError') {
              return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
          }
         res.status(500).json({ success: false, message: 'Server error updating donation.' });
     }
 };

 exports.deleteDonation = async (req, res) => {
     try {
         const donationId = req.params.id;
         if (!mongoose.Types.ObjectId.isValid(donationId)) {
              return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
          }

          const deletedDonation = await Donation.findByIdAndDelete(donationId);

          if (!deletedDonation) {
              return res.status(404).json({ success: false, message: 'Donation not found.' });
          }

          res.json({ success: true, message: 'Donation deleted successfully.' });

      } catch (err) {
          console.error("Delete Donation Error:", err);
          res.status(500).json({ success: false, message: 'Server error deleting donation.' });
      }
  };