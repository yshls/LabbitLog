import css from './postlistpage.module.css'
import PostCard from '../components/PostCard'

export const PostListPage = () => {
  return (
    <main className={css.postlistpage}>
      <h2>글목록</h2>

      <ul className={css.postList}>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
      </ul>
    </main>
  )
}
