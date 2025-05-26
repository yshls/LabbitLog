import css from './postlistpage.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import PostCard from '../components/PostCard'
import { getPostList } from '../api/postApi'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 페이지네이션을 위한 상태 추가
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

  // 마지막 게시글 요소를 감지하는 ref 콜백
  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      observer.current.observer(node)
    },
    [isLoading, hasMore]
  )

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        // 페이지가 0보다 크면 추가 데이터 로딩
        if (page > 0) setIsLoading(true)
        // 수정된 페이지 정보 전달
        const data = await getPostList(page)
      } catch (error) {}
    }
  })

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
