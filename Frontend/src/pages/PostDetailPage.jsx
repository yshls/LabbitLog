// /detail/:postId 경로로 들어왔을 때 보여지는 페이지입니다.
import css from './postdetailpage.module.css'
import { useEffect, useState, useRef } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FaRegFileAlt } from 'react-icons/fa'

import { Link, useParams } from 'react-router-dom'
import { getPostDetail, deletePost } from '../apis/postApi'
import { formatDate } from '../utils/features'
import { useSelector } from 'react-redux'
import { Toaster, toast } from 'react-hot-toast'
import { TbMessageCircle } from 'react-icons/tb'

import { RiSingleQuotesL } from 'react-icons/ri'
import { RiSingleQuotesR } from 'react-icons/ri'

import LikeButton from '../components/LikeButton'
import { Comments } from '../components/Comments'
import VariableProximity from '../components/VariableProximity'

import { FaEdit } from 'react-icons/fa'

// 상세 페이지 컴포넌트
export const PostDetailPage = () => {
  const containerRef = useRef(null)

  const username = useSelector(state => state.user.user.username)
  const { postId } = useParams()
  console.log(postId) // postId는 URL 파라미터로 전달된 값입니다.
  // postId를 이용하여 서버에 요청하여 상세 정보를 가져옵니다.

  const [postInfo, setPostInfo] = useState({}) // 상세 정보를 저장할 상태

  // 댓글 수 상태관리
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId) // postId를 이용하여 상세 정보를 가져옵니다.
        console.log(data)
        setPostInfo(data)
        // 초기 댓글 수 설정(백엔드에서 전달받은 경우)
        setCommentCount(data.commentCount || 0)
      } catch (error) {
        console.error('상세정보 조회 실패:', error)
      }
    }
    fetchPostDetail()
  }, [postId])

  // 댓글 수를 업데이트하는 함수
  const updateCommentCount = count => {
    setCommentCount(count)
  }
  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId) // postId를 이용하여 글을 삭제합니다.
        toast.success('삭제되었습니다.')
        window.location.href = '/' // 삭제 후 목록 페이지로 이동합니다.
      } catch (error) {
        console.error('글 삭제 실패:', error)
        toast.error('삭제에 실패했습니다.')
      }
    }
  }

  return (
    <main className={css.postdetailpage}>
      <section ref={containerRef}>
        {/* 제목 */}
        <h1 className={css.title}>
          <VariableProximity
            label={postInfo?.title || ''}
            containerRef={containerRef}
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            className={css.variableProximityText}
            radius={100}
            falloff="linear"
          />
        </h1>

        {/* 요약 */}
        <div className={css.summary}>
          <RiSingleQuotesL />
          {postInfo?.summary}
          <RiSingleQuotesR />
        </div>

        {/* 작성자, 날짜, 좋아요, 댓글 수 */}
        <div className={css.info}>
          <div className={css.between}>
            <p className={css.author}>{postInfo?.author}</p>
            <p className={css.date}>{formatDate(postInfo?.updatedAt)}</p>
          </div>
          <div className={css.between}>
            <p>
              {postInfo && <LikeButton postId={postId} likes={postInfo.likes} />}
              <span style={{ marginLeft: '10px' }}>
                <TbMessageCircle />
                {commentCount}
              </span>
            </p>
          </div>
        </div>

        {/* 이미지 */}
        {postInfo?.cover && (
          <div className={css.detailimg}>
            <img src={`${import.meta.env.VITE_BACK_URL}/${postInfo.cover}`} alt="cover" />
          </div>
        )}

        {/* 본문 콘텐츠는 info 바깥에 */}
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: postInfo?.content }}
        ></div>
      </section>

      <section className={css.btns}>
        {/* 로그인한 사용자만 글을 수정, 삭제할 수 있습니다. */}
        {username === postInfo?.author && (
          <div className={css.btnGroup}>
            <Link to={`/edit/${postId}`}>
              <FaEdit />
              수정
            </Link>
            <span onClick={handleDeletePost}>
              <FaTrashAlt />
              삭제
            </span>
          </div>
        )}
        <div className={css.btnGroup}>
          <Link to="/">
            <FaRegFileAlt />
            전체 글 보기
          </Link>
        </div>
      </section>
      {/* 업데이트된 Comments 컴포넌트에 commentCount와 updateCommentCount 함수 전달 */}
      <Comments
        postId={postId}
        commentCount={commentCount}
        onCommentCountChange={updateCommentCount}
      />
    </main>
  )
}
