import { Link } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { useNavigate } from 'react-router-dom'

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
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
      <h3 className={css.title}>{post.title}</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage/${post.author}`} onClick={handleAuthorClick} className={css.author}>
            {post.author}
          </Link>

          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </p>
        <p>
          <LikeButton postId={post._id} initialLikes={post.likes} />
          <span>💬</span> <span>{post.commentCount || 0}</span>
        </p>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}
