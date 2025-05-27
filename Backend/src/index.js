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
      const payload = { id: _id, email, username };

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

//백엔드 post 등록 로직
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { postModel } from './model/post.js';

import { fileURLToPath } from 'url';
// __dirname 설정 (ES 모듈에서는 __dirname이 기본적으로 제공되지 않음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
/**
 * 
mkdirSync: Node.js의 파일 시스템 모듈에서 제공하는 함수, 디렉토리를 만드는 함수
fs.mkdirSync 코드를 통해 
 */

/** null은 에러 없음을 의미한다. 한마디로 밑에 코드에서는 에러 없이 uploads 폴더에 저장해줘라는 의미 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 위의 코드는 multer를 사용할 때 파일을 서버에 저장하기 위한 설정 객체를 의미한다.

const upload = multer({ storage });

app.post('/postWrite', upload.single('files'), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: '로그인 필요' });
    }

    const userInfo = jwt.verify(token, secretKey);

    const postData = {
      title,
      summary,
      content,
      cover: req.file ? req.file.path : null, // 파일 경로 저장
      author: userInfo.username,
    };

    console.log('📤 저장 시도 데이터:', postData);

    const savedPost = await postModel.create(postData); // ✅ 한 번만 저장

    console.log('✅ 저장 완료:', savedPost);

    res.json({ message: '포스트 글쓰기 성공' });
  } catch (err) {
    console.log('에러', err);
    return res.status(500).json({ error: '서버 에러' });
  }
});

// 글 목록 조회 API - 페이지네이션 추가
app.get('/postList', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // 페이지 번호 0부터 시작
    const limit = parseInt(req.query.limit) || 3; // 한 페이지당 게시물 수 (기본값 3으로 설정함)
    const skip = page * limit; // 건너뛸 게시물 수

    // 총 게시물 수 조회
    const total = await postModel.countDocuments();
    console.log('📄 전체 게시글 수:', total);

    // 페이지네이션 적용하여 게시물 조회
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 }) // 최신순 정렬
      .skip(skip)
      .limit(limit);

    // 마지막 페이지 여부 확인
    const hasMore = total > skip + posts.length;

    res.json({
      posts,
      hasMore,
      total,
    });
  } catch (err) {
    console.error('게시물 조회 오류:', err);
    res.status(500).json({ error: '게시물 조회에 실패했습니다.' });
  }
});

// 글 상세 조회 api

app.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }
    res.json(post);
  } catch (err) {
    console.error('게시물 상세 조회 오류:', err);
    res.status(500).json({ error: '게시물 상세 조회에 실패했습니다.' });
  }
});

//글 삭제 API
app.delete('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }
    res.json({ message: '게시물이 삭제되었습니다.' });
  } catch (err) {
    console.error('게시물 삭제 오류:', err);
    res.status(500).json({ error: '게시물 삭제에 실패했습니다.' });
  }
});

// 글 수정 API
// 게시물 수정 API
app.put('/post/:postId', upload.single('files'), async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, summary, content } = req.body;
    const { token } = req.cookies;

    // 로그인 확인
    if (!token) {
      return res.status(401).json({ error: '로그인 필요' });
    }

    // 토큰 검증
    const userInfo = jwt.verify(token, secretKey);

    // 게시물 조회
    const post = await postModel.findById(postId);

    // 게시물이 존재하지 않을 경우
    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    // 작성자 확인 (자신의 글만 수정 가능)
    if (post.author !== userInfo.username) {
      return res.status(403).json({ error: '자신의 글만 수정할 수 있습니다.' });
    }

    // 수정할 데이터 객체 생성
    const updateData = {
      title,
      summary,
      content,
    };

    // 새 파일이 업로드된 경우 파일 경로 업데이트
    if (req.file) {
      updateData.cover = req.file.path;
    }

    // 게시물 업데이트
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true } // 업데이트된 문서 반환
    );

    res.json({
      message: '게시물이 수정되었습니다.',
      post: updatedPost,
    });
  } catch (err) {
    console.error('게시물 수정 오류:', err);
    res.status(500).json({ error: '게시물 수정에 실패했습니다.' });
  }
});
