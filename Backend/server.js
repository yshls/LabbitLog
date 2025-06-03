// server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; // ➊ mongoose import

// 라우트 가져오기
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import kakaoAuthRoutes from './routes/kakaoAuthRoutes.js'; // 이미 추가한 카카오 라우트

// 데이터베이스 연결
import connectDB from './config/db.js';

// 에러 핸들러
import { errorHandler } from './utils/errorHandler.js';
import { User } from './models/User.js'; // ➋ User 모델 import

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('🔎 요청 Origin:', req.headers.origin);
  next();
});
// 환경 변수에서 프론트엔드 URL 가져오기
console.log('🔥 FRONTEND_URL:', process.env.FRONTEND_URL);
// CORS 테스트용 라우터 만들기 (진짜 문제 찾는 용도)
app.get('/cors-test', (req, res) => {
  res.json({ ok: true, origin: req.headers.origin });
});

// CORS 설정
// server.js 또는 app.js에서
const whitelist = [
  process.env.FRONTEND_URL, // 예: https://labbitlog.vercel.app
  'http://localhost:5173', // 개발용
  undefined, // origin 없는 상황도 허용
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ CORS 차단됨:', origin);
        callback(new Error('CORS 차단: 허용되지 않은 origin'));
      }
    },
    credentials: true,
  })
);

//preflight OPTIONS 요청 처리 허용
app.options('*', cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 쿠키 파서 미들웨어
app.use(cookieParser());

// 정적 파일 제공 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 정적 파일 접근 시 CORS 오류를 방지하기 위한 설정
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

// ─── 데이터베이스 연결 ────────────────────────────────────────────────────────
connectDB() // ➌ 몽고 연결 시작
  .then(() => {
    // mongoose.connection.readyState가 1(DB 연결됨)을 의미
    mongoose.connection.once('open', async () => {
      try {
        console.log('>> MongoDB 연결됨, 이제 인덱스 삭제 시도');
        // users 컬렉션에 남아 있는 email_1 인덱스를 삭제
        await User.collection.dropIndex('email_1');
        console.log('>> email_1 인덱스가 삭제되었습니다.');
      } catch (err) {
        // 인덱스가 없거나 이미 삭제된 경우 에러가 날 수 있음
        console.error('인덱스 삭제 중 에러:', err.message);
      }
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
    process.exit(1);
  });
// ────────────────────────────────────────────────────────────────────────────────

// ─── 라우트 설정 ──────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/auth/kakao', kakaoAuthRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

// ✅ 루트 경로 응답 추가
app.get('/', (req, res) => {
  res.send('🟢 LabbitLog 백엔드 서버가 정상 작동 중입니다!');
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ error: '요청한 페이지를 찾을 수 없습니다.' });
});

// 에러 핸들러 미들웨어
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});

// 프로세스 종료 시 처리
process.on('SIGINT', () => {
  console.log('서버를 종료합니다.');
  process.exit(0);
});

// 예기치 않은 에러 처리
process.on('uncaughtException', (err) => {
  console.error('예기치 않은 에러:', err);
  process.exit(1);
});

console.log(`서버가 ${port} 포트에서 실행 중입니다.`);

// 등록된 모든 라우트 경로 출력 (디버깅용)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log('라우트 경로:', r.route.path);
  }
});
