const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Admin Routes (Protected - Admin only)
 */
router.use(protect);
router.use(authorize('admin', 'faculty'));

router.put('/activity/:id/approve', adminController.approveActivity);
router.put('/activity/:id/reject', adminController.rejectActivity);
router.get('/activities/pending', adminController.getPendingActivities);
router.get('/students', adminController.getAllStudents);
router.get('/faculty', adminController.getAllFaculty);
router.put('/students/:id/assign-faculty', adminController.assignFaculty);
router.get('/stats', adminController.getAdminStats);
router.get('/reports/naac', adminController.getNAACReport);

module.exports = router;
