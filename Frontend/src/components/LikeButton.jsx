import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toggleLike } from '../apis/postApi'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import './likebutton.css' // pop 클래스 있는 곳

export default function LikeButton({ postId, likes, className = '' }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0)
  const [pop, setPop] = useState(false)

  useEffect(() => {
    if (userId && likes) {
      setIsLiked(likes.includes(userId))
    } else {
      setIsLiked(false)
    }
  }, [likes, userId])

  const handleLikeToggle = async e => {
    e.stopPropagation()
    try {
      const updatedPost = await toggleLike(postId)
      setIsLiked(!isLiked)
      setLikesCount(updatedPost.likes.length)
      setPop(true)
      setTimeout(() => setPop(false), 300)
    } catch (error) {
      console.error('좋아요 토글 실패:', error)
      if (error.response?.status === 401) {
        toast.error('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }

  return (
    <span className={className}>
      <span
        onClick={handleLikeToggle}
        style={{ cursor: 'pointer', display: 'inline-block' }}
        className={pop ? 'pop' : ''}
      >
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likesCount}</span>
    </span>
  )
}
