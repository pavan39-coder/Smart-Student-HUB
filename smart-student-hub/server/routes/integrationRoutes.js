const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const integrationController = require('../controllers/integrationController');

router.use(protect);
router.use(authorize('admin', 'faculty'));

router.get('/providers', integrationController.getProviders);
router.get('/export/student/:studentId', integrationController.exportStudentData);
router.post('/push', integrationController.pushToProvider);

module.exports = router;
