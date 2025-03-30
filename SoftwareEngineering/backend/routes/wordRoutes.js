const express = require('express');
const Word = require('../models/Word');

const router = express.Router();

// ✅ 단어 전체 조회 API
router.get('/', async (req, res) => {
  try {
    const words = await Word.find(); // 모든 단어 가져오기
    res.json(words);
  } catch (err) {
    console.error('❌ 단어 불러오기 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
