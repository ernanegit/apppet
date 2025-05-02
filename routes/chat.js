const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, chatController.sendMessage);
router.get('/', chatController.getMessages);

module.exports = router;