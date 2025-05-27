import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

// 댓 작성 API
export const createComment = async commentData => {
  const response = await axios.post(`${API_URL}/comment`, commentData)
  return response.data
}

// 댓 목록 조회
export const getComments = async postId => {
  const response = await axios.get(`${API_URL}/comments/${postId}`)
  return response.data
}
