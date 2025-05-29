import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserInfo, getUserProfile } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'
import css from './userinfoupdate.module.css'

export const UserInfoUpdate = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    //로그인 상태가 아니면 로그인 페이지로 리다이렉트
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])
}
