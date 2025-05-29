import axios from 'axios'
axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const loginUser = async credentials => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  return response.data
}

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`)
  return response.data
}

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`)
  return response.data
}
// 사용자 페이지 관련 API들
// 특정 사용자 정보 조회
export const getUserInfo = async username => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`)
    return response.data
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 글 조회
export const getUserPosts = async username => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}/posts`)
    return response.data
  } catch (err) {
    console.error('사용자 게시물 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 작성한 댓글 조회
export const getUserComments = async username => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}/comments`)
    return response.data
  } catch (err) {
    console.error('사용자 댓글 조회 실패:', err)
    throw err
  }
}

// 특정 사용자가 좋아요 클릭한 글 조회
export const getUserLikes = async username => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}/likes`)
    return response.data
  } catch (err) {
    console.error('사용자 좋아요 게시물 조회 실패:', err)
    throw err
  }
}

// 사용자 정보 수정
export const updateUserInfo = async userData => {
  try {
    const response = await axios.put(`${API_URL}/user/update`, userData)
    return response.data
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err)
    throw err
  }
}
