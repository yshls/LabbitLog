import { useSelector } from 'react-redux'
import css from './comments.module.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createComment, getComments, deleteComment } from '../apis/commentApi'
import { formatDate } from '../utils/features'

export const Comments = ({ postId }) => {
  const userInfo = useSelector(state => state.user.user)

  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId)
        console.log('댓글 목록 조회 성공:', response)
        setComments(response)
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error)
        alert('댓글 목록 조회에 실패했습니다.')
      }
    }
    fetchComments()
  }, [postId])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!newComment) {
      alert('댓글을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      const commentData = {
        content: newComment,
        author: userInfo.username,
        postId: postId,
      }

      const response = await createComment(commentData)
      console.log('댓글 등록 성공:', response)

      setComments(prevComments => [response, ...prevComments])
      setNewComment('')

      setIsLoading(false)
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록에 실패했습니다.')
      setIsLoading(false)
    }
  }

  // 댓글 삭제 핸들러
  const handleDelete = async commentId => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        setIsLoading(true)
        // 댓글 삭제 API 호출
        const response = await deleteComment(commentId)
        console.log('댓글 삭제 성공:', response)
        // 댓글 목록에서 삭제된 댓글 제거
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId))
        setIsLoading(false)
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
        alert('댓글 삭제에 실패했습니다.')
        setIsLoading(false)
      }
    }
  }

  return (
    <section className={css.comments}>
      {userInfo.username ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={isLoading}
          ></textarea>
          <button type="submit" disabled={isLoading}>
            {isLoading ? '등록 중...' : '댓글 등록'}
          </button>
        </form>
      ) : (
        <p className={css.logMessage}>
          댓글을 작성하려면 <Link to="/login">로그인이 필요합니다.</Link>
        </p>
      )}

      <ul>
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <li key={comment._id} className={css.list}>
              <div className={css.commnet}>
                <p className={css.author}>{comment.author}</p>
                <p className={css.date}>{formatDate(comment.createdAt)}</p>
                <p className={css.text}>{comment.content}</p>
              </div>
              {userInfo.username === comment.author && (
                <div className={css.btns}>
                  <button>수정</button>
                  <button onClick={() => handleDelete(comment._id)}>삭제</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className={css.list}>
            <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          </li>
        )}
      </ul>
    </section>
  )
}
