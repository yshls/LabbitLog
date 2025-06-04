import axios from 'axios'
axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

// 댓글 작성 API
export const createComment = async commentData => {
  const response = await axios.post(`${API_URL}/comments`, commentData)
  return response.data
}

// 댓글 목록 조회 (postId별)
export const getComments = async postId => {
  const response = await axios.get(`${API_URL}/comments/${postId}`)
  return response.data
}

// 댓글 삭제 API
export const deleteComment = async commentId => {
  const response = await axios.delete(`${API_URL}/comments/${commentId}`)
  return response.data
}

// 댓글 수정 API
export const updateComment = async (commentId, content) => {
  const response = await axios.put(`${API_URL}/comments/${commentId}`, { content })
  return response.data
}

/**
댓글이 안 적히는 오류가 발생했었다.
그 이유는 댓글 작성 시 postId가 없었기 때문이었다.
그래서 
클라이언트 코드에서는 POST /comment처럼 /comment(singular)로 요청을 보냈기 때문에,
백엔드(Express)는 “/comment” 경로를 찾지 못하고 404를 반환하게 된것..

이 문제를 해결하기 위해서는 클라이언트 코드에서 댓글 작성 시 postId를 포함시켜야 한다.
*/
