// ========== schemas/dailyMission.js ==========
// Mongoose 모델: DailyMission
// 매일 제공되는 미션 정보를 저장합니다.
const mongoose = require('mongoose');

const DailyMissionSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },            // 미션 날짜
  description: { type: String, required: true }                  // 미션 설명
});

module.exports = mongoose.model('DailyMission', DailyMissionSchema);