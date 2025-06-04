import dotenv from 'dotenv';
dotenv.config(); // .env 파일에서 환경변수 불러오기

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

// 각종 라우트 파일 임포트

import connectDB from './config/db.js'; // DB 연결 함수 임포트
import { errorHandler } from './utils/errorHandler.js'; // 에러 핸들러 임포트
import { User } from './models/User.js'; // User 모델 임포트

const app = express();
const port = process.env.PORT || 3000; // 포트 지정 (.env 없으면 3000)

// CORS 설정 (로컬, 배포 모두 허용)
const whitelist = ['https://labbitlog.vercel.app', 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔥 요청 Origin:', origin); // 요청 온 origin 출력
    if (!origin || whitelist.includes(origin)) {
      callback(null, true); // 허용된 origin만 통과
    } else {
      console.warn('❌ CORS 차단됨:', origin); // 차단 로그 출력
      callback(new Error('CORS 차단: 허용되지 않은 origin')); // 허용 안 된 origin은 에러 반환
    }
  },
  credentials: true, // 쿠키 인증 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용 메서드 지정
};

// 미들웨어 설정
app.use(cors(corsOptions)); // CORS 미들웨어 등록
app.options('*', cors(corsOptions)); // preflight 요청 대응
app.use(express.json()); // JSON 파싱 미들웨어 등록
app.use(cookieParser()); // 쿠키 파싱 미들웨어 등록

// 정적 파일 경로 설정
const __filename = fileURLToPath(import.meta.url); // 현재 파일의 전체 경로
const __dirname = path.dirname(__filename); // 현재 파일이 속한 폴더 경로
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 업로드 폴더 정적 경로로 사용
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename)); // 업로드된 파일 직접 제공
});

// 라우팅
app.use('/auth', authRoutes); // 인증 라우트 등록
app.use('/auth/kakao', kakaoAuthRoutes); // 카카오 인증 라우트 등록
app.use('/posts', postRoutes); // 포스트 관련 라우트 등록
app.use('/comments', commentRoutes); // 댓글 관련 라우트 등록
app.use('/users', userRoutes); // 사용자 관련 라우트 등록

// 루트 경로
app.get('/', (req, res) => {
  res.send('🟢 LabbitLog 백엔드 서버가 정상 작동 중입니다!'); // 서버 상태 확인 메시지
});

// CORS 테스트용 라우트
app.get('/cors-test', (req, res) => {
  res.json({ ok: true, origin: req.headers.origin }); // CORS 테스트 응답 반환
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ error: '요청한 페이지를 찾을 수 없습니다.' }); // 모든 미등록 라우트 404 처리
});

// 에러 핸들러
app.use(errorHandler); // 공통 에러 처리 미들웨어 등록

// MongoDB 연결
connectDB()
  .then(() => {
    mongoose.connection.once('open', async () => {
      try {
        console.log('>> MongoDB 연결됨, 인덱스 정리 중...');
        await User.collection.dropIndex('email_1'); // email 인덱스 삭제 시도 (존재 안해도 무시)
        console.log('>> email_1 인덱스가 삭제되었습니다.');
      } catch (err) {
        console.warn('⚠️ 인덱스 삭제 실패 (무시 가능):', err.message); // 인덱스 삭제 에러는 경고만 출력
      }
    });
  })
  .catch((err) => {
    console.error('❌ DB 연결 실패:', err);
    process.exit(1); // DB 연결 실패 시 서버 종료
  });

console.log(app._router.stack.filter((r) => r.route).map((r) => r.route.path)); // 등록된 라우트 경로 출력

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버가 ${port} 포트에서 실행 중입니다.`); // 서버 시작 메시지 출력
});

// 예외 처리
process.on('SIGINT', () => {
  console.log('👋 서버 종료 중...');
  process.exit(0); // Ctrl+C 시 서버 정상 종료
});
process.on('uncaughtException', (err) => {
  console.error('💥 예기치 못한 에러:', err);
  process.exit(1); // 처리 못한 에러 발생 시 서버 강제 종료
});
