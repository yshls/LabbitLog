import css from './loginpage.module.css'
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
import { Link } from 'react-router-dom'

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

      // 무조건 로그인 성공했으면 홈으로 이동
      navigate('/')
    } catch (err) {
      console.error(err)
      setLoginError('로그인 실패: 아이디 또는 비밀번호를 확인하세요')
    }
  }

  return (
    <div className={css.fullscreenWrapper}>
      <main className={css.loginpage}>
        <div className={css.leftSection}>
          <h3>
            바쁜 하루에도
            <br /> 나만의 작은 쉼표를 남겨보세요.
          </h3>
          <img src={logoFull} alt="로고" className={css.loginLogo} />
          <p>
            아직 회원이 아니신가요?{' '}
            <Link to="/register">
              <strong>지금 가입하기</strong>
            </Link>
          </p>
        </div>

        <div className={css.rightSection}>
          <h2>로그인</h2>
          {loginError && <strong className={css.error}>{loginError}</strong>}
          <form className={css.container} onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} placeholder="이메일" />
            <strong>{errors.email?.message}</strong>

            <input {...register('password')} type="password" placeholder="비밀번호" />
            <strong>{errors.password?.message}</strong>

            <button type="submit">로그인</button>
          </form>
          <div className={css.socialLogin}>
            <p>소셜 계정으로 로그인</p>
            <KakaoLoginButton />
          </div>
        </div>
      </main>
    </div>
  )
}
