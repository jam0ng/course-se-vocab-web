const express = require('express');
const Word = require('../models/Word');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ 단어 추가
router.post('/add', verifyToken, isAdmin, async (req, res) => {
  try {
    const { english, korean, example } = req.body;
    const newWord = new Word({ english, korean, example });
    await newWord.save();
    res.status(201).json({ message: '단어가 추가되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '단어 추가 실패', error: err.message });
  }
});

// ✅ 단어 수정
router.put('/edit/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { english, korean, example } = req.body;
    await Word.findByIdAndUpdate(req.params.id, { english, korean, example });
    res.status(200).json({ message: '단어가 수정되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '단어 수정 실패', error: err.message });
  }
});

// ✅ 단어 삭제
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Word.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '단어가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '단어 삭제 실패', error: err.message });
  }
});

module.exports = router;
