import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey, tokenLife, cookieOptions } from '../config/jwt.js';

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

export const register = async (req, res) => {
  try {
    console.log('----', req.body);
    const { name, email, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 유효성 검사
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // 사용자 저장
    const userDoc = new User({
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
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });
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
};

export const getProfile = (req, res) => {
  const { token } = req.cookies;
  // console.log("쿠키", token);
  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  jwt.verify(token, secretKey, (err, info) => {
    if (err) {
      return res.status(401).json({ error: '토큰이 유효하지 않습니다.' });
    }

    res.json(info);
  });
};

export const logout = (req, res) => {
  // 쿠키 옵션을 로그인과 일관되게 유지하되, maxAge만 0으로 설정
  const logoutCookieOptions = {
    ...cookieOptions,
    maxAge: 0,
  };

  res
    .cookie('token', '', logoutCookieOptions)
    .json({ message: '로그아웃 되었음' });
};
