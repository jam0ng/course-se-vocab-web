const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const QuizMission = require('../models/quizMission');

const router = express.Router();

// POST /api/quizzes/submit
// 정확하게 count + 점수를 갱신하여 응답에 포함시킴
router.post('/submit', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  try {
    let mission = await QuizMission.findOne({ userId, date: todayStart });

    if (!mission) {
      mission = new QuizMission({ userId, date: todayStart, count: 1, score: 1 });
    } else {
      mission.count += 1;
      mission.score = mission.count; // ✅ 1문제 = 1점
    }

    await mission.save();

    return res.json({ message: '퀴즈 제출 처리', mission });
  } catch (err) {
    return res.status(500).json({ message: '퀴즈 제출 실패', error: err.message });
  }
});




// GET /api/quizzes/today
router.get('/today', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    const record = await QuizMission.findOne({ userId, date: todayStart });
    return res.json(record || { count: 0, score: 0 });
  } catch (err) {
    return res.status(500).json({ message: '퀴즈 정보 조회 실패', error: err.message });
  }
});

module.exports = router;
