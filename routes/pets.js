const express = require('express');
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, petController.upload, petController.addPet);
router.get('/', petController.getPets);
router.get('/:id', petController.getPetById);
router.put('/:id', authMiddleware, petController.upload, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;