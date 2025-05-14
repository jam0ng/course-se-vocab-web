// ========== routes/quizRouter.js ==========
const express2 = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const QuizMission = require('../schemas/quizMission');

const quizRouter = express2.Router();

// POST /api/quiz/submit
// 사용자가 퀴즈를 풀 때마다 호출됩니다. count 10마다 5점 부여
quizRouter.post('/submit', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    // upsert하여 count 증가
    let mission = await QuizMission.findOneAndUpdate(
      { userId, date: todayStart },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    // 퀴즈 점수 계산: 10개당 5점
    const quizScore = Math.floor(mission.count / 10) * 5;
    mission.score = quizScore;
    await mission.save();
    return res.json({ message: '퀴즈 제출 처리', mission });
  } catch (err) {
    return res.status(500).json({ message: '퀴즈 제출 실패', error: err.message });
  }
});

// GET /api/quiz/today
// 사용자의 오늘 퀴즈 미션 상태 조회
quizRouter.get('/today', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    const record = await QuizMission.findOne({ userId, date: todayStart });
    return res.json(record || { count: 0, score: 0 });
  } catch (err) {
    return res.status(500).json({ message: '퀴즈 정보 조회 실패', error: err.message });
  }
});

module.exports = quizRouter;
