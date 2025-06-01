import { Link } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { useNavigate } from 'react-router-dom'

import { FaRegComment } from 'react-icons/fa'

import LikeButton from './LikeButton' // 좋아요 버튼 컴포넌트

export default function PostCard({ post }) {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/detail/${post._id}`)
  }
  const handleAuthorClick = e => {
    e.stopPropagation() // 이벤트 전파 방지
  }

  return (
    <article className={css.postcard} onClick={goDetail}>
      <div className={css.text}>
        <h3 className={css.title}>{post.title}</h3>
        <div className={css.info}>
          <p>
            <Link to={`/mypage/${post.author}`} onClick={handleAuthorClick} className={css.author}>
              {post.author}
            </Link>
            <time className={css.date}>{formatDate(post.createdAt)}</time>
            <LikeButton postId={post._id} initialLikes={post.likes} />
            <span>
              <FaRegComment />
            </span>
            <span>{post.commentCount || 0}</span>
          </p>
          <p className={css.summary}>{post.summary}</p>
        </div>
      </div>
      <div className={css.thumbnail}>
        {post.cover && (
          <div className={css.thumbnail}>
            <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
          </div>
        )}
      </div>
    </article>
  )
}
