import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

export const createPost = async postData => {
  const response = await axios.post(`${API_URL}/posts`, postData)
  return response.data
}

// 글 목록 조회 API - 페이지네이션 지원
export const getPostList = async (page = 0, limit = 3) => {
  const response = await axios.get(`${API_URL}/posts`, {
    params: { page, limit },
  })
  return response.data
}

// 글 상세 조회 API
export const getPostDetail = async postId => {
  const response = await axios.get(`${API_URL}/posts/${postId}`)
  return response.data
}

// 글 삭제 API
export const deletePost = async postId => {
  const response = await axios.delete(`${API_URL}/posts/${postId}`)
  return response.data
}

// 글 수정 API
export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${API_URL}/posts/${postId}`, postData)
  return response.data
}

// 좋아요 토글 API
export const toggleLike = async postId => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`)
  return response.data
}
