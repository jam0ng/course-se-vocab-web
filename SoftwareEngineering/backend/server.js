// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const wordRoutes = require('./routes/wordRoutes');
app.use('/api/words', wordRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quiz', quizRoutes);

const adminWordRoutes = require('./routes/adminWordRoutes');
app.use('/api/admin/words', adminWordRoutes);

const bookmarkRoutes = require('./routes/bookmarkRoutes');
app.use('/api/bookmarks', bookmarkRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const rankingRoutes = require('./routes/rankingRoutes');
app.use('/api/rankings', rankingRoutes);

const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendances', attendanceRoutes);

const quizMissionRoutes = require('./routes/quizMissionRoutes');
app.use('/api/quizzes', quizMissionRoutes);

// 테스트용 기본 라우트
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동 중입니다!');
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
