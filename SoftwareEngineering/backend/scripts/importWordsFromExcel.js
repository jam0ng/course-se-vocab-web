// 단어 데이터 파일(엑셀) MongoDB에 저장
// models/Word.js 파일과 연관

const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Word = require('../models/Word');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB 연결 완료');
  importWords();
}).catch((err) => {
  console.error('❌ MongoDB 연결 실패:', err);
});

async function importWords() {
  try {
    const workbook = xlsx.readFile('./scripts/영단어 데이터(알파벳순).xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    const words = data.map(row => ({
      english: row.English,
      korean: row.Korean,
      example: row['Example Sentence'] || '',
      cloze: row['Cloze Sentence'] || ''
    }));

    await Word.insertMany(words);
    console.log(`✅ ${words.length}개의 단어를 MongoDB에 저장 완료!`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ 단어 저장 중 오류:', err);
    mongoose.disconnect();
  }
}
