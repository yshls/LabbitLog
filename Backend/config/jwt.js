import dotenv from 'dotenv';
dotenv.config();

export const secretKey = process.env.JWT_SECRET;
export const tokenLife = process.env.JWT_EXPIRATION;

export const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60, // 1시간
  secure: true, // HTTPS 환경에서만 작동하도록 설정
  sameSite: 'none', // 크로스 도메인 요청 허용
  path: '/',
};

/**
'strict' :
완전히 크로스 사이트 쿠키 전송 차단 (로그인 유지 불편할 수 있음)

'lax' :
GET, HEAD 같은 안전한 요청에만 크로스 전송 허용 (대부분의 로그인 쿠키에 많이 씀)

'none' :
모든 크로스 사이트 요청에 쿠키 전송 허용
(단, secure: true도 반드시 필요! → https 환경만 가능)

*/
