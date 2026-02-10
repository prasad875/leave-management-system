const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/teachers', authController.getTeachers);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
