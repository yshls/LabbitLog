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
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    // 비밀번호 유효성 검사
    if (password) {
      if (password.length < 9) {
        setError('비밀번호는 최소 8자 이상이어야 합니다.')
        return
      }

      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }
    }

    try {
      setLoading(true)

      // 비밀번호 변경 요청
      const userData = {
        password: password || undefined, // 비밀번호가 비어있으면 undefined로 설정하여 서버에 전송하지 않음
      }

      await updateUserInfo(userData)

      // 프로필 정보 다시 불러오기
      const updatedProfile = await getUserProfile()
      dispatch(setUserInfo(updatedProfile))

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSuccess(false)
        navigate(`/userpage/${user.username}`)
      }, 1000)
    } catch (err) {
      console.error('사용자 정보 업데이트 실패:', err)
      setError(err.response?.data?.error || '사용자 정보 업데이트에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/user/${user.username}`)
  }

  if (!user) return null // 로그인 상태가 아니면 아무것도 렌더링하지 않음

  return (
    <main className={css.userinfoupdate}>
      <h2>내 정보 수정</h2>

      <form onSubmit={handleSubmit} className={css.updateForm}>
        <div className={css.formGroup}>
          <label htmlFor="username">사용자 이름</label>
          <input
            type="text"
            id="username"
            value={user.username || ''}
            disabled
            className={css.disabledInput}
          />
          <p className={css.helperText}>사용자 이름은 변경할 수 없습니다.</p>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="변경할 비밀번호를 입력하세요"
            className={css.input}
          />
          <p className={css.helperText}>
            비밀번호는 최소 8자 이상이어야 합니다. 변경하지 않으려면 비워두세요.
          </p>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인"
            className={css.input}
          />
        </div>

        {error && <div className={css.errorMessage}>{error}</div>}
        {success && (
          <div className={css.successMessage}>사용자 정보가 성공적으로 업데이트되었습니다.</div>
        )}

        <div className={css.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={css.cancelButton}
            disabled={loading}
          >
            취소
          </button>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? '처리 중...' : '저장'}
          </button>
        </div>
      </form>
    </main>
  )
}
