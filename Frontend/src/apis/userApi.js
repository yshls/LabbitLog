import axios from 'axios'

axios.defaults.withCredentials = true // 모든 요청에 대해 withCredentials 설정
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/auth/register`, userData)
  return response.data
}

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

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`)
  return response.data
}

export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/profile`)
    return res.data
  } catch (err) {
    console.error('프로필 조회 실패:', err)
    throw err
  }
}

// 사용자 페이지 관련 API들
// 특정 사용자 정보 조회
export const getUserInfo = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 글 조회
export const getUserPosts = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/posts`)
    return response.data
  } catch (err) {
    console.error('사용자 게시물 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 댓글 조회
export const getUserComments = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/comments`)
    return response.data
  } catch (err) {
    console.error('사용자 댓글 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 좋아요 클릭한 글 조회
export const getUserLikes = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/likes`)
    return response.data
  } catch (err) {
    console.error('사용자 좋아요 게시물 조회 실패:', err)
    throw err
  }
}

// 사용자 정보 수정
export const updateUserInfo = async userData => {
  try {
    const response = await axios.put(`${API_URL}/users/update`, userData)
    return response.data
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err)
    throw err
  }
}
