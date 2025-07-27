const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true
  },
  email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'] 
  },
  contact: { 
      type: String,
      required: [true, 'Contact information (phone or address) is required.'],
      trim: true
  },
  role: {
      type: String,
      required: [true, 'User role is required.'],
      enum: ['collector', 'distributor'] 
  },
  password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.']
  },
  categories: {
      type: String,
      required: function() { return this.role === 'distributor'; },
      trim: true
  },
  region: {
      type: String,
      required: function() { return this.role === 'collector'; },
      trim: true
  },
  requirements: {
      type: String,
      required: function() { return this.role === 'collector'; },
      trim: true
  },
  createdAt: {
      type: Date,
      default: Date.now
  }

});

// userSchema.pre('save', async function(next) {
//   // Only hash the password if it has been modified (or is new)
//   if (!this.isModified('password')) return next();
//
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model('User', userSchema);