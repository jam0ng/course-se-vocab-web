// ========== schemas/dailyAttendance.js ==========
// Mongoose 모델: DailyAttendance
// 사용자의 일일 출석 체크 정보를 저장합니다.
const mongoose = require('mongoose');

const DailyAttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },                   // 출석 날짜 (시작 시각 기준)
  checked: { type: Boolean, default: true },             // 출석 여부
  score: { type: Number, default: 1 }                     // 출석 점수 (기본 1점)
});

// userId + date로 유니크 인덱스 생성
DailyAttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyAttendance', DailyAttendanceSchema);
