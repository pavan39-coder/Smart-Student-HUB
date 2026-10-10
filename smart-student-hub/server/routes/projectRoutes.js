const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Project Routes
 */
router.get('/', projectController.getAllProjects);
router.get('/user/:userId', projectController.getProjectsByUser);

// Protected routes
router.post('/add', protect, authorize('student'), projectController.addProject);
router.get('/my', protect, projectController.getMyProjects);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);

router.get('/:id', projectController.getProject);

module.exports = router;
