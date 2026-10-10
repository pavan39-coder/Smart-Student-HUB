const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

/**
 * User Routes (Protected)
 */
router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/update', userController.updateProfile);
router.get('/stats', userController.getUserStats);
router.put('/portfolio/toggle', userController.togglePortfolioVisibility);

module.exports = router;
