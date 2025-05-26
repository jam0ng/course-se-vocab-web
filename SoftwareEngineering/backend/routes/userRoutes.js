// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ 닉네임 수정
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: '닉네임을 입력해주세요.' });

    await User.findByIdAndUpdate(userId, { username });
    res.json({ message: '닉네임이 변경되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '닉네임 수정 실패', error: err.message });
  }
});

// ✅ 비밀번호 변경
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '비밀번호 변경 실패', error: err.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username');
    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: '사용자 정보 조회 실패' });
  }
});

module.exports = router;
