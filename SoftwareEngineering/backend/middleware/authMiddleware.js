// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// ✅ 1. 로그인한 사용자만 접근 가능 (토큰 검증)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다. 접근 불가!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, role 등 저장됨
    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// ✅ 2. 관리자만 접근 가능
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자만 접근 가능합니다.' });
  }
  next();
};

// ✅ 3. (선택) 일반 사용자만 접근 가능 (예: 관리자 제외)
const requireUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: '일반 사용자만 접근 가능합니다.' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireUser,
};
