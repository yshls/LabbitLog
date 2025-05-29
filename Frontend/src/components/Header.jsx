import css from './header.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'

export const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)

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
      setIsMenuActive(false)
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

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev)
  }
  const closeMenu = () => {
    setIsMenuActive(false)
  }
  // 배경 영역(gnbCon)만 클릭 시 닫히도록 하는 핸들러
  const handleBackgroundClick = e => {
    // 클릭된 요소가 css.gnbCon 클래스를 가진 요소와 동일할 때만 closeMenu 실행
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  // gnb 영역 클릭 시 이벤트 전파 중단
  const handleGnbClick = e => {
    e.stopPropagation()
  }
  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>LabbitLog</Link>
      </h1>
      <Hamburger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
      <nav className={css.gnbCon} onClick={handleBackgroundClick}>
        <div className={css.gnb} onClick={handleGnbClick}>
          {username ? (
            <>
              <MenuLike to="/createPost" label="글쓰기" closeMenu={closeMenu} />
              <MenuLike
                to={`/mypage/${username}`}
                label={`마이페이지(${username})`}
                closeMenu={closeMenu}
              />

              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <MenuLike to="/register" label="회원가입" closeMenu={closeMenu} />
              <MenuLike to="/login" label="로그인" closeMenu={closeMenu} />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

const MenuLike = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
)

const Hamburger = ({ isMenuActive, toggleMenu }) => (
  <button className={`${css.hamburger} ${isMenuActive ? css.active : ''}`} onClick={toggleMenu}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="bi bi-list"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
      />
    </svg>
  </button>
)
