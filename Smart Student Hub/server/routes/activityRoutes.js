const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * Activity Routes
 */
router.post('/add', protect, upload.single('certificate'), activityController.addActivity);
router.get('/my', protect, activityController.getMyActivities);
router.get('/:id', protect, activityController.getActivity);
router.put(
  '/:id',
  protect,
  upload.single('certificate'),
  activityController.updateActivity
);
router.delete('/:id', protect, activityController.deleteActivity);

module.exports = router;
