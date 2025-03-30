// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ✅ 회원가입 API
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;

// ✅ 로그인 API
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 사용자 찾기
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: '이메일이 존재하지 않습니다.' });
      }
  
      // 비밀번호 비교
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
      }
  
      // JWT 토큰 생성
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role, // 관리자 여부 확인용
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: '로그인 성공!',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 에러' });
    }
  });
  