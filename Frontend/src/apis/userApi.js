import axios from 'axios'

// axios 모든 요청에 쿠키 자동 포함 설정
axios.defaults.withCredentials = true

// 백엔드 API 기본 URL (배포 시 환경변수 사용, 로컬 기본값 3000 포트)
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

// 사용자 회원가입 API 호출
export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/auth/register`, userData)
  return response.data
}

// 사용자 로그인 API 호출
export const loginUser = async credentials => {
  try {
    console.log('📤 로그인 요청 데이터:', credentials)
    const response = await axios.post(`${API_URL}/auth/login`, credentials)
    return response.data
  } catch (err) {
    console.error('❌ 로그인 에러:', err.response?.data || err.message)
    throw err
  }
}

// 사용자 로그아웃 API 호출
export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`)
  return response.data
}

// 현재 로그인한 사용자 프로필 조회 API 호출
export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/profile`)
    return res.data
  } catch (err) {
    console.error('프로필 조회 실패:', err)
    throw err
  }
}

// 특정 사용자 정보 조회 (백엔드 라우트: /users/info/:username)
export const getUserInfo = async username => {
  try {
    // username을 경로에 넣어 API 호출
    const response = await axios.get(`${API_URL}/users/info/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 글 조회 (백엔드 라우트: /users/posts/:username)
export const getUserPosts = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/posts/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 게시물 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 댓글 조회 (백엔드 라우트: /users/comments/:username)
export const getUserComments = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/comments/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 댓글 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 좋아요 클릭한 글 조회 (백엔드 라우트: /users/likes/:username)
export const getUserLikes = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/likes/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 좋아요 게시물 조회 실패:', err)
    throw err
  }
}

// 사용자 정보 수정 API 호출 (인증 필요, PUT /users/update)
export const updateUserInfo = async userData => {
  try {
    const response = await axios.put(`${API_URL}/users/update`, userData)
    return response.data
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err)
    throw err
  }
}
