const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

/**
 * Leaderboard Routes (Public)
 */
router.get('/', leaderboardController.getLeaderboard);
router.get('/rank/:userId', leaderboardController.getUserRank);

module.exports = router;
