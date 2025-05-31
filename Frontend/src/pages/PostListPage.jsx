import css from './postlistpage.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import PostCard from '../components/PostCard'
import { getPostList } from '../apis/postApi'
import { Search } from '../components/Search'
import LoadingSpinner from '../components/LoadingSpinner'

export const PostListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 페이지네이션을 위한 상태 추가
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  // 검색 필터 적용
  const filteredPosts = postList.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 마지막 게시물 요소를 감지하는 ref 콜백
  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          console.log('📌 관찰 중:', entries[0])
          if (entries[0].isIntersecting && hasMore) {
            setPage(prev => prev + 1)
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1,
        }
      )

      observer.current.observe(node)
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
        //
        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('목록조회 실패:', error)
        setError('글 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostList()
  }, [page])

  return (
    <main className={css.postlistpage}>
      {/* 검색바 추가 */}
      <Search value={searchTerm} onChange={handleSearchChange} />

      {/* 에러 메시지 */}
      {error && <p className={css.errorMessage}>{error}</p>}

      {/* 로딩 & 게시물 없음 */}
      {isLoading && page === 0 ? (
        <LoadingSpinner />
      ) : filteredPosts.length === 0 ? (
        <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
      ) : (
        // 게시물 리스트 렌더링
        <ul className={css.postList} ref={listRef}>
          {filteredPosts.map((post, i) => (
            <li key={post._id} ref={i === filteredPosts.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
