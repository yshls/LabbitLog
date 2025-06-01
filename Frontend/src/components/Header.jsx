import css from './header.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'
import logo from '../assets/logo.png'
import Modal from 'react-modal'
import { CreatePost } from '../pages/CreatePost'
import { RiAccountCircleLine } from 'react-icons/ri'
import { FaPlus } from 'react-icons/fa6'
import { IoIosClose } from 'react-icons/io'

Modal.setAppElement('#root') // 접근성 설정

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const username = user?.username

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile()
        dispatch(setUserInfo(userData || ''))
      } catch (err) {
        console.error('프로필 조회 실패:', err)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error('로그아웃 실패:', err)
    } finally {
      dispatch(setUserInfo(''))
    }
  }

  if (isLoading) {
    return (
      <>
        <aside className={css.sidebar}>
          <div className={css.logo}>
            <Link to="/">
              <img src={logo} alt="LabbitLog Logo" />
            </Link>
          </div>
          <nav className={css.nav}>
            {username && (
              <>
                <button onClick={() => setIsModalOpen(true)} className={css.menuBtn}>
                  <FaPlus />
                </button>
                <MenuLike to={`/mypage/${username}`} icon={<RiAccountCircleLine />} />
              </>
            )}
          </nav>
        </aside>

        <div className={css.topRight}>
          <span>로딩 중...</span>
        </div>
      </>
    )
  }

  return (
    <>
      {/* 왼쪽 사이드바 */}
      <aside className={css.sidebar}>
        <div className={css.logo}>
          <Link to="/">
            <img src={logo} alt="LabbitLog Logo" />
          </Link>
        </div>
        <nav className={css.nav}>
          {username && (
            <>
              <button onClick={() => setIsModalOpen(true)} className={css.menuBtn}>
                <FaPlus />
              </button>
              <MenuLike to={`/mypage/${username}`} icon={<RiAccountCircleLine />} />
            </>
          )}
        </nav>
      </aside>

      {/* 오른쪽 상단 */}
      <div className={css.topRight}>
        {!username ? (
          <div className={css.topRight}>
            <MenuLike to="/login" label="로그인" className={css.loginBtn} />
          </div>
        ) : (
          <button onClick={handleLogout} className={css.logoutBtn}>
            로그아웃
          </button>
        )}
      </div>

      {/* 글쓰기 모달 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="글쓰기 모달"
        className={css.modal}
        overlayClassName={css.overlay}
      >
        <button onClick={() => setIsModalOpen(false)} className={css.closeBtn}>
          <IoIosClose />
        </button>
        <CreatePost onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

// 공통 네비게이션 링크 컴포넌트
const MenuLike = ({ to, label, icon, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${className ? className : ''} ${isActive ? css.active : ''}`}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </div>
  </NavLink>
)
