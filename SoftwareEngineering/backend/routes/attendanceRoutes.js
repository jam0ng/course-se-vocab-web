// ========== routes/router.js ==========
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const DailyAttendance = require('../models/dailyAttendance');

const router = express.Router();

// POST /api/attendance/checkin
// 사용자의 오늘 출석 체크를 처리합니다.
router.post('/checkin', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    const attendance = await DailyAttendance.findOneAndUpdate(
      { userId, date: todayStart },
      { checked: true, score: 1 },
      { upsert: true, new: true }
    );
    return res.json({ message: '출석 체크 완료', attendance });
  } catch (err) {
    return res.status(500).json({ message: '출석 체크 실패', error: err.message });
  }
});

// GET /api/attendance/today
// 사용자의 오늘 출석 상태를 반환합니다.
router.get('/today', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  try {
    const record = await DailyAttendance.findOne({ userId, date: todayStart });
    return res.json(record || { checked: false, score: 0 });
  } catch (err) {
    return res.status(500).json({ message: '출석 정보 조회 실패', error: err.message });
  }
});

module.exports = router;