import css from './header.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'
import logo from '../assets/logo.gif'

export const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const username = user?.username
  console.log(username)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserProfile()
        if (userData) {
          dispatch(setUserInfo(userData))
        }
      } catch (err) {
        console.log(err)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(setUserInfo(''))
    } catch (err) {
      console.log('프로필 조회 실패:', err)
      // 401 에러는 로그인 필요 상태이므로 정상 처리
      dispatch(setUserInfo(''))
    }
  }

  // 로딩 중일 때는 메뉴 표시하지 않음
  if (isLoading) {
    return (
      <header className={css.header}>
        <h1>
          <Link to={'/'}>LabbitLog</Link>
        </h1>
        <div>로딩 중...</div>
      </header>
    )
  }

  return (
    <aside className={css.sidebar}>
      <h1 className={css.logo}>
        <Link to="/">
          <img src={logo} alt="LabbitLog Logo" />
        </Link>
      </h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <nav className={css.nav}>
          {username ? (
            <>
              <MenuLike to="/createPost" label="글쓰기" />
              <MenuLike
                to={`/mypage/${username}`}
                label="마이페이지"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
              />
              <button onClick={handleLogout} className={css.logoutBtn}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <MenuLike to="/register" label="회원가입" />
              <MenuLike to="/login" label="로그인" />
            </>
          )}
        </nav>
      )}
    </aside>
  )
}

const MenuLike = ({ to, label }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')}>
    {label}
  </NavLink>
)
