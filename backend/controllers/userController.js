const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
             return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
         }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, user });

    } catch (err) {
        console.error("Get User By ID Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching user.' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
         if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
          }
        const allowedUpdates = ['name', 'contact', 'categories', 'region', 'requirements', 'email'];
        const updates = {};
        let emailChanged = false;

         const existingUser = await User.findById(userId);
         if (!existingUser) {
             return res.status(404).json({ success: false, message: 'User not found.' });
         }


        for (const key in req.body) {
            if (allowedUpdates.includes(key)) {
                updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];

                 if (key === 'email') {
                     updates[key] = updates[key].toLowerCase(); 
                      if (updates[key] !== existingUser.email) {
                          if (!/\S+@\S+\.\S+/.test(updates[key])) {
                               return res.status(400).json({ success: false, message: 'Invalid email format.' });
                           }
                           const emailExists = await User.findOne({ email: updates[key], _id: { $ne: userId } });
                           if (emailExists) {
                               return res.status(400).json({ success: false, message: 'This email address is already in use by another account.' });
                           }
                           emailChanged = true; 
                      }
                  }

                  if (existingUser.role === 'distributor' && key === 'categories' && !updates[key]) {
                      return res.status(400).json({ success: false, message: 'Categories field cannot be empty for distributors.' });
                  }
                  if (existingUser.role === 'collector') {
                       if (key === 'region' && !updates[key]) return res.status(400).json({ success: false, message: 'Region field cannot be empty for collectors.' });
                       if (key === 'requirements' && !updates[key]) return res.status(400).json({ success: false, message: 'Requirements field cannot be empty for collectors.' });
                   }

            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates }, 
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found during update.' });
        }

        res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });

    } catch (err) {
        console.error("Update User Error:", err);
         if (err.name === 'ValidationError') {
             return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
         }
          if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
              return res.status(400).json({ success: false, message: 'Email address is already in use.' });
          }
        res.status(500).json({ success: false, message: 'Server error updating user profile.' });
    }
};


// GET all users 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (err) {
        console.error("Get All Users Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching users.' });
    }
};