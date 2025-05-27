import { Link } from 'react-router-dom'
import css from './postcard.module.css'

export default function PostCard({ post }) {
  const { title, summary, cover, author, createdAt } = post
  return (
    <article className={css.postcard}>
      <div className={css.post_img}>
        <img src={cover} ?`http://localhost:4000/$`
      </div>
      <h3 className={css.title}>포스트제목이 들어갑니다.</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage`} className={css.author}>
            ysh
          </Link>
          <time className={css.date}>2025.05.05</time>
        </p>
        <p>
          <span>❤️</span> <span>30</span> <span>💬</span> <span>30</span>
        </p>
      </div>
      <p className={css.dec}>
        요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수
        있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길
        ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요
      </p>
    </article>
  )
}
