import css from './registerpage.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../apis/userApi.js'

import { useDispatch } from 'react-redux'
import { setUserInfo } from '../store/userSlice'
import logoFull from '../assets/logo-full.png'

import KakaoLoginButton from '../components/KakaoLoginButton'

// yup 스키마
const schema = yup.object({
  email: yup.string().required('이메일을 입력해주세요').email('이메일 형식이 아닙니다'),
  password: yup.string().required('비밀번호를 입력해주세요'),
})

export const LoginPage = () => {
  const [loginState, setLoginState] = useState('')
  const [redirect, setRedirect] = useState(false)

  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()

  // 로그인 시도
  const onSubmit = async data => {
    try {
      const res = await loginUser(data)

      if (res.email && res.username) {
        dispatch(setUserInfo({ username: res.username, email: res.email }))
        navigate('/')
      } else {
        setLoginError('로그인 실패: 아이디 또는 비밀번호를 확인하세요')
      }
    } catch (err) {
      console.error(err)
      setLoginError('서버 오류가 발생했습니다')
    }
  }

  return (
    <main className={css.loginpage}>
      <img src={logoFull} alt="로고" className={css.loginLogo} />
      <h2>로그인</h2>
      {loginError && <strong>{loginError}</strong>}
      <form className={css.container} onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="이메일" />
        <strong>{errors.email?.message}</strong>

        <input {...register('password')} type="password" placeholder="비밀번호" />
        <strong>{errors.password?.message}</strong>

        <button type="submit">로그인</button>
      </form>
      {/* 소셜 로그인 섹션 추가 */}
      <div className={css.socialLogin}>
        <p>소셜 계정으로 로그인</p>
        <KakaoLoginButton />
      </div>
    </main>
  )
}
