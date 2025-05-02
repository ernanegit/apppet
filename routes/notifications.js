const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/token', authMiddleware, notificationController.registerToken);
router.delete('/token', authMiddleware, notificationController.unregisterToken);

module.exports = router;