import css from './header.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'
import logo from '../assets/logo.gif'
import Modal from 'react-modal'
import { CreatePost } from '../pages/CreatePost'

Modal.setAppElement('#root') // 접근성 설정 (최상단 DOM)

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      <div className={css.logo}>
        <Link to="/">
          <img src={logo} alt="LabbitLog Logo" />
        </Link>
      </div>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <nav className={css.nav}>
          {username ? (
            <>
              <div className="wrapper">
                <button onClick={() => setIsModalOpen(true)} className={css.menuBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    class="size-6"
                    style={{ display: 'block' }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
                <MenuLike
                  to={`/mypage/${username}`}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width="40"
                      height="40"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  }
                />
              </div>

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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="글쓰기 모달"
        className={css.modal}
        overlayClassName={css.overlay}
      >
        <button onClick={() => setIsModalOpen(false)} className={css.closeBtn}>
          ✕
        </button>
        <CreatePost onClose={() => setIsModalOpen(false)} />
      </Modal>
    </aside>
  )
}

const MenuLike = ({ to, label, icon }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  </NavLink>
)
