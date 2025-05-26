import axios from 'axios'
axios.defaults.withCredentials
const API_URL = import.meta.env.VITE_BACK_URL

export const createPost = async postData => {
  const responce = await axios.post(`${API_URL}/postWrite`, postData)
  return responce.data
}
