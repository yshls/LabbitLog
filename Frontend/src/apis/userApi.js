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
