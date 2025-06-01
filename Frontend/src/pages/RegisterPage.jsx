import css from './registerpage.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../apis/userApi'

import KakaoLoginButton from '../components/KakaoLoginButton'

const schema = yup.object({
  name: yup.string().required('이름을 입력해주세요').max(20, '20자 이하로 입력해주세요'),
  email: yup.string().required('이메일을 입력해주세요').email('이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '8자 이상 입력해주세요')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
      '영문, 숫자, 특수문자를 포함해야 합니다'
    ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다'),
})

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [registerState, setRegisterState] = useState('')
  const navigate = useNavigate()

  const onSubmit = async data => {
    console.log('제출된 값:', data)
    // try catch는 왜 작성하는지?
    // try catch는 에러가 발생했을 때, 에러를 잡아서 처리하기 위해 작성합니다.
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (res.success) {
        navigate('/login')
      } else {
        setRegisterState('회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
      setRegisterState('서버 오류가 발생했습니다.')
    }
  }
  return (
    <main className={css.registerpage}>
      <h2>회원가입</h2>
      {/* 여기에 메시지를 출력! */}
      {registerState && <p className={css.error}>{registerState}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className={css.container}>
        <input {...register('name')} placeholder="이름" />
        <strong>{errors.name?.message}</strong>

        <input {...register('email')} placeholder="이메일" />
        <strong>{errors.email?.message}</strong>

        <input
          {...register('password')}
          type="password"
          placeholder="비밀번호: 영문, 숫자, 특수기호 포함, 8자 이상"
        />
        <strong>{errors.password?.message}</strong>

        <input {...register('confirmPassword')} type="password" placeholder="비밀번호 확인" />
        <strong>{errors.confirmPassword?.message}</strong>

        <button type="submit">가입하기</button>
      </form>

      {/* 소셜 로그인 섹션 추가 */}
      <div className={css.socialLogin}>
        <p>소셜 계정으로 로그인</p>
        <KakaoLoginButton />
      </div>
    </main>
  )
}

/**
Submit에서 onClick이벤트를 작성안해도 될까?
react-hook-form에서 handleSubmit을 사용하면, onClick이벤트를 작성하지 않아도된다.
*/
