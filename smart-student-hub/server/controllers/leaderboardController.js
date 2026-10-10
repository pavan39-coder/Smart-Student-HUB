const User = require('../models/User');

/**
 * @desc    Get leaderboard
 * @route   GET /api/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 100, skip = 0 } = req.query;

    const leaderboard = await User.find({ role: 'student' })
      .select('name points email portfolioId')
      .sort({ points: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Add rank
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: parseInt(skip) + index + 1,
      ...user.toObject(),
    }));

    const totalStudents = await User.countDocuments({ role: 'student' });

    res.status(200).json({
      success: true,
      totalStudents,
      count: leaderboardWithRank.length,
      data: leaderboardWithRank,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user rank
 * @route   GET /api/leaderboard/rank/:userId
 * @access  Public
 */
exports.getUserRank = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const rank =
      (await User.countDocuments({
        role: 'student',
        points: { $gt: user.points },
      })) + 1;

    res.status(200).json({
      success: true,
      data: {
        rank,
        points: user.points,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
