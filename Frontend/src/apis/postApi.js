import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

export const createPost = async postData => {
  const responce = await axios.post(`${API_URL}/postWrite`, postData)
  return responce.data
}
// 글 목록 조회 API - 페이지네이션 지원
export const getPostList = async (page = 0, limit = 3) => {
  const response = await axios.get(`${API_URL}/postList`, {
    params: { page, limit },
  })
  return response.data
}
// 글 상세 조회 API
export const getPostDetail = async postId => {
  const response = await axios.get(`${API_URL}/post/${postId}`)
  return response.data
}

// 글 삭제 API
export const deletePost = async postId => {
  const response = await axios.delete(`${API_URL}/post/${postId}`)
  return response.data
}
