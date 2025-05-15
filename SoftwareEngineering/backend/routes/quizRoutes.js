// routes/quizRoutes.js

const express = require('express');
const Word = require('../models/Word');

const router = express.Router();

router.get('/word', async (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'easy';

    const words = await Word.find();
    if (words.length < 4) {
      return res.status(400).json({ message: '단어가 4개 이상 등록되어야 퀴즈를 낼 수 있습니다.' });
    }

    const correct = words[Math.floor(Math.random() * words.length)];

    // 오답 보기 선택
    let choices = words
      .filter(w => w._id.toString() !== correct._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.english);

    choices.push(correct.english);
    choices = choices.sort(() => 0.5 - Math.random());

    // 쉬움 난이도: 뜻 → 영어
    if (difficulty === 'easy') {
      return res.json({
        english: correct.english,
        korean: correct.korean,
        example: correct.example,
        options: choices,
        answer: correct.english,
        _id: correct._id
      });
    }

    // 어려움 난이도: 예문 빈칸
    const blankedExample = correct.example.replace(
      new RegExp(correct.english, 'gi'),
      '_____'
    );

    return res.json({
      english: correct.english,
      example: blankedExample,
      options: choices,
      answer: correct.english,
      _id: correct._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '퀴즈 불러오기 실패' });
  }
});

module.exports = router;
