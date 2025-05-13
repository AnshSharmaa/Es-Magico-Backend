const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Important: More specific routes must come before generic routes
// GET top matching profiles based on a reference profile
router.get('/matches/:referenceProfileId', profileController.getTopMatches);

// POST connect with a profile
router.post('/connect/:userId/:targetId', profileController.connectWithProfile);

// POST reject a profile
router.post('/reject/:userId/:targetId', profileController.rejectProfile);

// GET connection status between two users
router.get('/status/:userId/:targetId', profileController.getConnectionStatus);

// GET a profile by ID (generic route with parameter)
router.get('/:id', profileController.getProfileById);

module.exports = router; 