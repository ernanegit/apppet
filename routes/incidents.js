const express = require('express');
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, incidentController.reportIncident);
router.get('/', incidentController.getIncidents);
router.put('/:id/status', authMiddleware, incidentController.updateIncidentStatus);

module.exports = router;