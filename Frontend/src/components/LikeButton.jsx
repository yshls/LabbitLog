import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { toggleLike } from '../apis/postApi'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import './likebutton.css'
import { IoIosHeartEmpty } from 'react-icons/io'
import { IoHeart } from 'react-icons/io5'
import party from 'party-js'

export default function LikeButton({ postId, likes, className = '' }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0)
  const heartRef = useRef()

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

      // 🎉 하트 주변에 confetti 효과 터뜨리기
      if (heartRef.current) {
        party.confetti(heartRef.current, {
          count: 11,

          spread: 5,
        })
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error)
      if (error.response?.status === 401) {
        toast.error('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }

  return (
    <span className={`${className} likeWrapper`}>
      <span
        ref={heartRef}
        onClick={handleLikeToggle}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {isLiked ? <IoHeart /> : <IoIosHeartEmpty />}
      </span>
      <span>{likesCount}</span>
    </span>
  )
}
