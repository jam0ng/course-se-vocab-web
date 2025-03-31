// routes/quizRoutes.js

const express = require('express');
const Word = require('../models/Word');

const router = express.Router();

// ✅ 퀴즈 출제 API (뜻 → 영어 보기)
router.get('/word', async (req, res) => {
  try {
    const words = await Word.find();
    if (words.length < 4) {
      return res.status(400).json({ message: '단어가 4개 이상 등록되어야 퀴즈를 낼 수 있습니다.' });
    }

    // ✅ 정답 단어 랜덤 선택
    const correct = words[Math.floor(Math.random() * words.length)];

    // ✅ 보기용 영어단어 3개 랜덤 선택 (정답 제외)
    let choices = words
      .filter(w => w._id.toString() !== correct._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.english);

    // ✅ 정답 삽입 후 섞기
    choices.push(correct.english);
    choices = choices.sort(() => 0.5 - Math.random());

    // ✅ 응답
    res.json({
      english: correct.english,
      korean: correct.korean,
      example: correct.example,
      choices
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '퀴즈 불러오기 실패' });
  }
});

module.exports = router;
