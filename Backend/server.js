import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import kakaoAuthRoutes from './routes/kakaoAuthRoutes.js';

import connectDB from './config/db.js';
import { errorHandler } from './utils/errorHandler.js';
import { User } from './models/User.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정 (로컬, 배포 모두 허용)
const whitelist = ['http://localhost:5173', 'https://labbitlog.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔥 요청 Origin:', origin);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS 차단됨:', origin);
      callback(new Error('CORS 차단: 허용되지 않은 origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight 대응
app.use(express.json());
app.use(cookieParser());

// 정적 파일 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

// 라우팅
app.use('/auth', authRoutes);
app.use('/kakao', kakaoAuthRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

// 루트 경로
app.get('/', (req, res) => {
  res.send('🟢 LabbitLog 백엔드 서버가 정상 작동 중입니다!');
});

// CORS 테스트용 라우트
app.get('/cors-test', (req, res) => {
  res.json({ ok: true, origin: req.headers.origin });
});

// 404 처리
// 404 처리 (v5 스타일 패턴 기반)
app.all('/{*}', (req, res) => {
  res.status(404).json({ error: '요청한 페이지를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use(errorHandler);

// MongoDB 연결
connectDB()
  .then(() => {
    mongoose.connection.once('open', async () => {
      try {
        console.log('>> MongoDB 연결됨, 인덱스 정리 중...');
        await User.collection.dropIndex('email_1'); // 이미 있으면 무시됨
        console.log('>> email_1 인덱스가 삭제되었습니다.');
      } catch (err) {
        console.warn('⚠️ 인덱스 삭제 실패 (무시 가능):', err.message);
      }
    });
  })
  .catch((err) => {
    console.error('❌ DB 연결 실패:', err);
    process.exit(1);
  });

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버가 ${port} 포트에서 실행 중입니다.`);
});

// 예외 처리
process.on('SIGINT', () => {
  console.log('👋 서버 종료 중...');
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  console.error('💥 예기치 못한 에러:', err);
  process.exit(1);
});
