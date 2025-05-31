import kakaoLoginBtn from '../assets/kakao_login_medium_narrow.png' // 카카오 로그인 버튼 이미지
const API_URL = import.meta.env.VITE_BACK_URL

const KakaoLoginButton = () => {
  const handleKakaoLogin = () => {
    window.location.href = `${API_URL}/auth/kakao/login`
  }

  return (
    <button
      onClick={handleKakaoLogin}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <img src={kakaoLoginBtn} alt="카카오 로그인" />
    </button>
  )
}

export default KakaoLoginButton
