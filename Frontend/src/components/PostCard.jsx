import { Link } from 'react-router-dom'
import css from './postcard.module.css'

export default function PostCard({ post }) {
  const { title, summary, cover, author, createdAt } = post
  return (
    <article className={css.postcard}>
      <div className={css.post_img}>
        <img
          src={cover ? `http://localhost:4000/${cover}` : 'https://picsum.photos/600/300'}
          alt=""
        />
      </div>
      <h3 className={css.title}>{title}</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage`} className={css.author}>
            {author}
          </Link>
          <time className={css.date}>{new Date(createdAt).toLocaleDateString('ko-KR')}</time>
        </p>
        <p>
          <span>❤️</span> <span>0</span> <span>💬</span> <span>0</span>
        </p>
      </div>
      <p className={css.dec}>{summary}</p>
    </article>
  )
}
