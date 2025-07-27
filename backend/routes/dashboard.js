const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/distributor/:id', dashboardController.getDistributorDashboard);

router.get('/collector/:id', dashboardController.getCollectorDashboard);

module.exports = router;