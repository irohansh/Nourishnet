const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware'); 

router.get('/:id', userController.getUserById);

router.put('/:id', /* protect, authorizeSelf, */ userController.updateUser);

// router.get('/', /* protect, authorizeAdmin, */ userController.getAllUsers);


module.exports = router;