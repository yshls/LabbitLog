import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserInfo, getUserPosts, getUserComments, getUserLikes } from '../apis/userApi' // 경로는 실제 프로젝트 구조에 맞게 조정
import css from './mypages.module.css' // CSS 모듈을 사용하여 스타일링
import { formatDate } from '../utils/features'

export const MyPage = () => {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 현재 로그인한 사용자 정보
  const currentUser = useSelector(state => state.user.user)
  const isCurrentUser = currentUser && currentUser.username === username
  useEffect(() => {
    console.log('username 파라미터 확인:', username)
  }, [username])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // API 호출을 통해 데이터 가져오기
        const userData = await getUserInfo(username)
        const postsData = await getUserPosts(username)
        const commentsData = await getUserComments(username)
        const likesData = await getUserLikes(username)

        setUserData(userData)
        setUserPosts(postsData)
        setUserComments(commentsData)
        setUserLikes(likesData)
        setLoading(false)
      } catch (err) {
        console.error('사용자 데이터 로딩 실패:', err)
        setError('사용자 정보를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>

  return (
    <main className={css.userpage}>
      <h2>{username}님의 페이지</h2>

      <section>
        <h3>사용자 정보</h3>
        <div className={css.userInfo}>
          <p>
            <strong>사용자 이름:</strong> {userData.username}
          </p>
          <p>
            <strong>가입일:</strong>{' '}
            {userData.createdAt ? formatDate(userData.createdAt) : '날짜 없음'}
          </p>
          <p>
            <strong>최근 수정일:</strong> {formatDate(userData.updatedAt)}
          </p>
          {isCurrentUser && (
            <div>
              <Link to={`/update-profile`} className={css.editButton}>
                비밀번호 변경
              </Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3>작성한 글 ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          <ul className={css.postList}>
            {userPosts.map(post => (
              <li key={post._id} className={css.postCard}>
                <Link to={`/detail/${post._id}`}>
                  <p className={css.title}>{post.title}</p>
                  <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>작성한 댓글 ({userComments.length})</h3>
        {userComments.length > 0 ? (
          <ul className={css.commentList}>
            {userComments.map(comment => (
              <li key={comment._id} className={css.commentCard}>
                <p className={css.commentContent}>{comment.content}</p>
                <div className={css.commentMeta}>
                  <Link to={`/detail/${comment.postId}`}>원문 보기</Link>
                  <p>작성일:{formatDate(comment.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>좋아요 클릭한 글 ({userLikes.length})</h3>
        {userLikes.length > 0 ? (
          <ul className={css.likeList}>
            {userLikes.map(post => (
              <li key={post._id} className={css.likeCard}>
                <Link to={`/detail/${post._id}`}>
                  {post.cover ? (
                    <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
                  ) : (
                    <img src="https://picsum.photos/200/300" alt="기본 이미지" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>좋아요 클릭한 글이 없습니다.</p>
        )}
      </section>
    </main>
  )
}
