// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// ✅ 뜻 고르기 퀴즈 API
router.get('/word', async (req, res) => {
  try {
    const allWords = await Word.find();

    // 정답 하나 랜덤 선택
    const correct = allWords[Math.floor(Math.random() * allWords.length)];

    // 오답 후보 3개 랜덤 추출 (중복 피하기)
    const wrongChoices = allWords
      .filter(w => w.korean !== correct.korean)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // 정답 + 오답 섞기
    const choices = [...wrongChoices, correct]
      .sort(() => 0.5 - Math.random())
      .map(choice => choice.korean);

    res.json({
      english: correct.english,
      correct: correct.korean,
      choices
    });
  } catch (err) {
    console.error('❌ 퀴즈 생성 실패:', err);
    res.status(500).json({ message: '퀴즈 생성 중 오류 발생' });
  }
});

module.exports = router;
