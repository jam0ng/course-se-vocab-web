// ========== routes/rankingRouter.js ==========
const express3 = require('express');
const DailyAttendance2 = require('../schemas/dailyAttendance');
const QuizMission2 = require('../schemas/quizMission');

const rankingRouter2 = express3.Router();

// GET /api/rankings/today
// 오늘의 출석 + 퀴즈 점수를 합산한 랭킹을 반환합니다.
rankingRouter2.get('/today', async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    // 출석 점수 aggregation
    const attendanceAgg = await DailyAttendance2.aggregate([
      { $match: { date: todayStart, checked: true } },
      { $group: { _id: '$userId', attendanceScore: { $sum: '$score' } } }
    ]);
    // 퀴즈 점수 aggregation
    const quizAgg = await QuizMission2.aggregate([
      { $match: { date: todayStart } },
      { $group: { _id: '$userId', quizScore: { $sum: '$score' } } }
    ]);
    // 합산을 위해 map 변환
    const scoreMap = new Map();
    attendanceAgg.forEach(a => scoreMap.set(a._id.toString(), a.attendanceScore));
    quizAgg.forEach(q => scoreMap.set(q._id.toString(), (scoreMap.get(q._id.toString())||0) + q.quizScore));
    // 정렬
    const rankings = Array.from(scoreMap.entries())
      .map(([userId, totalScore]) => ({ userId, totalScore }))
      .sort((a,b) => b.totalScore - a.totalScore)
      .slice(0, 100);
    return res.json(rankings);
  } catch (err) {
    return res.status(500).json({ message: '랭킹 조회 실패', error: err.message });
  }
});

module.exports = rankingRouter2;