import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const port = process.env.PORT || 4000;

import cors from 'cors';
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // true여야 쿠키 전송
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  })
);

app.use(express.json()); // JSON 파싱 미들웨어

import cookieParser from 'cookie-parser';
app.use(cookieParser()); // 쿠키 파싱 미들웨어

import mongoose from 'mongoose';
import { userModel } from './model/user.js'; // userModel import
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME, // 환경변수 적용
  })
  .then(() => {
    console.log('MongoDB 연결됨');
  })
  .catch((err) => {
    console.log('MongoDB 연결 안됨', err);
  });

import bcrypt from 'bcryptjs';
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;
const tokenLife = process.env.JWT_EXPIRATION; // 토큰 유효시간

const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60, // 쿠키 만료 시간 (1시간)
  secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 쿠키 전송
  sameSite: 'Strict', // CSRF 공격 방지
  path: '/', // 쿠키의 경로
};

app.post('/register', async (req, res) => {
  try {
    console.log('----', req.body);
    const { name, email, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 유효성 검사
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // 사용자 저장
    const userDoc = new userModel({
      username: name,
      email,
      password: hashedPassword,
    });

    const savedUser = await userDoc.save();

    res.status(201).json({
      success: true,
      msg: '회원가입 성공',
      user: {
        name: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error('에러', err);
    res.status(500).json({ error: '서버 에러' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});

// 로그인
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await userModel.findOne({ email });
    if (!userDoc) {
      return res.status(401).json({ error: '없는 사용자 입니다.' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
    } else {
      const { _id, email, username } = userDoc;
      const payload = { id: _id, email };

      const token = jwt.sign(payload, secretKey, {
        expiresIn: tokenLife,
      });

      // 쿠키에 토큰 저장
      res.cookie('token', token, cookieOptions).json({
        id: userDoc._id,
        email,
        username,
      });
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '로그인 실패' });
  }
});

//회원정보 조회
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  // console.log("쿠키", token);
  if (!token) {
    return res.json({ error: '로그인 필요' }); // 오류를 JSON 형식으로 응답
  }
  jwt.verify(token, secretKey, (err, info) => {
    if (err) {
      return res.json({ error: '로그인 필요' });
    }
    res.json(info);
  });
});

// 로그아웃
app.post('/logout', (req, res) => {
  // 쿠키 옵션을 로그인과 일관되게 유지하되, maxAge만 0으로 설정
  const logoutCookieOptions = {
    ...cookieOptions,
    maxAge: 0,
  };

  res
    .cookie('token', '', logoutCookieOptions)
    .json({ message: '로그아웃 되었음' });
});
