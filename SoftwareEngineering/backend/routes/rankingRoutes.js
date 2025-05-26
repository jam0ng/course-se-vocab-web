const express = require('express');
const DailyAttendance = require('../models/dailyAttendance');
const QuizMission = require('../models/quizMission');
const User = require('../models/User');

const router = express.Router();

// GET /api/rankings/today
router.get('/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const attendances = await DailyAttendance.find({ date: today });
    const quizzes = await QuizMission.find({ date: today });

    const scoreMap = {};

    for (const att of attendances) {
      scoreMap[att.userId] = (scoreMap[att.userId] || 0) + (att.score || 0);
    }
    for (const quiz of quizzes) {
      scoreMap[quiz.userId] = (scoreMap[quiz.userId] || 0) + (quiz.score || 0);
    }

    const userIds = Object.keys(scoreMap).filter(uid => uid && uid !== 'null');
    const users = await User.find({ _id: { $in: userIds } });

    const ranking = userIds.map((uid) => {
      const user = users.find((u) => u._id.toString() === uid);
      return {
        username: user?.username || `사용자 ${uid.slice(-4)}`,
        totalScore: scoreMap[uid] || 0
      };
    });

    ranking.sort((a, b) => b.totalScore - a.totalScore);
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ message: '랭킹 조회 실패', error: err.message });
  }
});

module.exports = router;
