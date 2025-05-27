import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { toggleLike } from '../apis/postApi'

import { useSelector } from 'react-redux'

export default function PostCard({ postId, likes, className = '' }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id // 현재 로그인한 사용자의 ID

  // 현재 로그인한 사용자의 정보가 필요합니다.
  // 예를 들어, 좋아요 기능을 구현할 때 사용자의 ID가 필요

  // 초기 상태를 설정할때 로그인한 사용자가 이미 좋아요 눌렀는지 확인
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0)

  // 컴포넌트 마운트 시 및 post 나 userId가 변경될때 좋아요 상태 확인
  useEffect(() => {
    if (userId && likes) {
      //사용자가 로그인한 상태이고, 게시물에 좋아요 배열이 있는 경우
      const userLiked = likes.inclues(userId)
      setIsLiked(userLiked)
    } else {
      setIsLiked(false)
    }
  }, [likes, userId])

  const handleLikeToggle = async e => {
    e.stopPropagation() // 이벤트 전파 방지

    try {
      // 좋아요 토글 API 호출
      const updatedPost = await toggleLike(postId)

      // 상태 업데이트
      setIsLiked(!isLiked)
      setLikesCount(updatedPost.likes.length)
    } catch (error) {
      console.error('좋아요 토글 실패:', error)

      // 로그인이 필요한 경우 로그인 페이지로 이동
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }

  return (
    <span className={className}>
      <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likesCount}</span>
    </span>
  )
}
