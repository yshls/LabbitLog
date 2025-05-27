import css from './postdetailpage.module.css'
import { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
// /detail/:postId 경로로 들어왔을 때 보여지는 페이지입니다.

import { getPostDetail, deletePost } from '../apis/postApi'
import { formatDate } from '../utils/features'
import { useSelector } from 'react-redux'

export const PostDetailPage = () => {
  const { postId } = useParams()
  console.log(postId) // postId는 URL 파라미터로 전달된 값입니다.
  // postId를 이용하여 서버에 요청하여 상세 정보를 가져옵니다.

  const username = useSelector(state => state.user.user.username)

  const [postInfo, setPostInfo] = useState()

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId) // postId를 이용하여 상세 정보를 가져옵니다.
        console.log(data)
        setPostInfo(data)
      } catch (error) {
        console.error('상세정보 조회 실패:', error)
      }
    }
    fetchPostDetail()
  }, [postId])

  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId) // postId를 이용하여 글을 삭제합니다.
        alert('삭제되었습니다.')
        window.location.href = '/' // 삭제 후 목록 페이지로 이동합니다.
      } catch (error) {
        console.error('글 삭제 실패:', error)
        alert('삭제에 실패했습니다.')
      }
    }
  }

  return (
    <main className={css.postdetailpage}>
      <h2>블로그 상세 페이지</h2>
      <section>
        <div className={css.detailimg}>
          <img src={`${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}`} alt="" />
          <h3>{postInfo?.title}</h3>
        </div>
        <div className={css.info}>
          <p className={css.author}>{postInfo?.author}</p>
          <p className={css.date}>{formatDate(postInfo?.updatedAt)}</p>
          <p>
            <span>❤️</span> <span>30</span>
          </p>
        </div>
        <div className={css.summary}>{postInfo?.summary}</div>
        {/* Quill 에디터로 작성된 HTML 콘텐츠를 렌더링 */}
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: postInfo?.content }}
        ></div>
      </section>

      <section className={css.btns}>
        {/* 로그인한 사용자만 글을 수정, 삭제 가능 */}
        {username === postInfo?.author && (
          <>
            <Link to={`/edit/${postId}`}>수정</Link>
            <span onClick={handleDeletePost}>삭제</span>
          </>
        )}
        <Link to="/">목록으로</Link>
      </section>

      <section className={css.commentlist}>댓글목록</section>
    </main>
  )
}
