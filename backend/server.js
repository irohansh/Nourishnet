
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config(); 

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nourishnet';

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1); 
  });

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- File Upload (Multer) Setup ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '..', 'uploads'); 
      
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// --- Static File Serving ---
app.use(express.static(path.join(__dirname, '..'))); 

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', upload.single('foodImage'), require('./routes/donations')); 
app.use('/api/users', require('./routes/user'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/feedback', require('./routes/feedback'));

// --- Basic Error Handling Middleware ---
// Multer error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  } else if (err) {
       console.error("File Upload Unknown Error:", err);
      if (err.message.includes('Not an image')) {
          return res.status(400).json({ success: false, message: err.message });
      }
       return res.status(500).json({ success: false, message: 'An unexpected error occurred during file processing.' });
  }
  next();
});

// General 404 for API routes not found
app.use('/api/*', (req, res) => {
   res.status(404).json({ success: false, message: 'API endpoint not found.' });
});


// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});