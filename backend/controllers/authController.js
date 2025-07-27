const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// REGISTER: Save new user to MongoDB
exports.register = async (req, res) => {
    try {
        const { name, email, contact, role, password, categories, region, requirements } = req.body;

        // Basic validation
        if (!name || !email || !contact || !role || !password) {
             return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }
         if (password.length < 6) {
             return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
         }

        // Check if user exists (by email)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

         // const salt = await bcrypt.genSalt(10);
         // const hashedPassword = await bcrypt.hash(password, salt);
         const hashedPassword = password;

        const newUser = new User({
            name,
            email: email.toLowerCase(), 
            contact,
            role,
            password: hashedPassword,
            ...(role === 'distributor' && { categories }),
            ...(role === 'collector' && { region, requirements }),
            createdAt: new Date(),
        });

        const savedUser = await newUser.save();

        const userToReturn = savedUser.toObject(); 
        delete userToReturn.password;

        res.status(201).json({ success: true, message: `Registered successfully as ${role}`, user: userToReturn });

    } catch (err) {
         console.error("Registration Error:", err);
         if (err.code === 11000) {
             return res.status(400).json({ success: false, message: 'Email already registered.' });
         }
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// LOGIN: Verify user credentials
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

         if (!identifier || !password) {
             return res.status(400).json({ success: false, message: 'Please provide identifier and password.' });
         }

        const user = await User.findOne({
             $or: [
                 { email: identifier.toLowerCase() },
                 { contact: identifier }
             ]
         }); //.select('+password'); 

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

         // const isMatch = await bcrypt.compare(password, user.password);
         const isMatch = (password === user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

         const userToReturn = user.toObject();
         delete userToReturn.password;

        res.json({ success: true, user: userToReturn });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

         if (!userId || !oldPassword || !newPassword) {
              return res.status(400).json({ success: false, message: 'Missing required fields.' });
         }
          if (newPassword.length < 6) {
              return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
          }

        const user = await User.findById(userId); //.select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // const isMatch = await bcrypt.compare(oldPassword, user.password);
         const isMatch = (oldPassword === user.password); 

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }

         if (oldPassword === newPassword) {
              return res.status(400).json({ success: false, message: 'New password cannot be the same as the old password.' });
         }
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(newPassword, salt);
         user.password = newPassword;

        await user.save();

        res.json({ success: true, message: 'Password updated successfully.' });

    } catch (err) {
        console.error("Change Password Error:", err);
        res.status(500).json({ success: false, message: 'Server error changing password.' });
    }
}
exports.forgotPassword = async (req, res) => {
    console.warn("Forgot password endpoint called, but not implemented.");
    res.status(501).json({ success: false, message: "Forgot password functionality is not implemented yet." });
};