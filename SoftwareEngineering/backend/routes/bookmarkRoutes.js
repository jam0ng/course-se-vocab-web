// backend/routes/bookmarkRoutes.js

const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { verifyToken } = require('../middlewares/authMiddleware');

// ✅ 북마크 단어 전체 정보 반환
router.get('/', verifyToken, async (req, res) => {
  try {
  const result = await Bookmark.findOne({ userId: req.user.userId })
      .populate('wordIds');
  
    res.json(result?.wordIds || []);
  } catch (err) {
    res.status(500).json({ message: '북마크 조회 실패' });
  }
});
  
// ✅ 북마크 추가
router.post('/:wordId', verifyToken, async (req, res) => {
  const { wordId } = req.params;
  try {
    const result = await Bookmark.findOneAndUpdate(
      { userId: req.user.userId },
      { $addToSet: { wordIds: wordId } },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '북마크 추가 실패' });
  }
});

// ✅ 북마크 삭제
router.delete('/:wordId', verifyToken, async (req, res) => {
  const { wordId } = req.params;
  try {
    const result = await Bookmark.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { wordIds: wordId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '북마크 삭제 실패' });
  }
});

module.exports = router;