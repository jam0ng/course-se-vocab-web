// ========== schemas/quizMission.js ==========
// Mongoose 모델: QuizMission
// 사용자의 일일 퀴즈 완료 정보를 저장합니다.
const mongoose2 = require('mongoose');

const QuizMissionSchema = new mongoose2.Schema({
  userId: { type: mongoose2.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },                   // 퀴즈 일자
  count: { type: Number, default: 0 },                    // 푼 퀴즈 개수
  score: { type: Number, default: 0 }                     // 퀴즈 점수 (예: 10개당 5점)
});

// userId + date로 유니크 인덱스 생성
QuizMissionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose2.model('QuizMission', QuizMissionSchema);