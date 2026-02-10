const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/requests', leaveController.submitRequest);
router.get('/requests', leaveController.getTeacherRequests);
router.get('/requests/student', leaveController.getStudentRequests);
router.get('/requests/:id', leaveController.getRequestById);
router.post('/requests/:id/process', leaveController.processRequest);
router.get('/student/:studentId/notifications', leaveController.getStudentNotifications);

module.exports = router;
