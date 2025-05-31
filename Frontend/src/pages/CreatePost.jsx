import css from './createpost.module.css'
import { useState, useEffect } from 'react'
import QuillEditor from '../components/QuillEditor'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createPost } from '../apis/postApi'

// CreatePost 컴포넌트: 글 작성 폼을 렌더링하고 제출을 처리함
export const CreatePost = ({ onClose }) => {
  const navigate = useNavigate()

  // 폼 상태값
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState(null)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 현재 로그인한 사용자 정보 가져오기
  const user = useSelector(state => state.user.user)

  // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  // 에디터 내용 변경 시 호출
  const handleContentChange = content => {
    setContent(content)
  }

  // 폼 제출 핸들러
  const handleCreatePost = async e => {
    e.preventDefault()
    console.log('제출')
    console.log(files)

    // 에러 초기화
    setError('')

    // 필수 항목 누락 시 에러 표시
    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('모든 필드를 입력해주세요')
      return
    }

    // 백엔드에 전송할 FormData 생성
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    if (files && files[0]) {
      data.set('files', files[0])
    }
    data.set('author', user._id)

    try {
      // 글 생성 API 호출
      const res = await createPost(data)
      console.log('등록성공', res)

      // 모달로 열렸을 경우 onClose 호출 / 아니면 홈으로 이동
      if (onClose) {
        onClose()
      } else {
        navigate('/')
      }
    } catch (err) {
      console.log(err)
    } finally {
      // 제출 상태 및 에러 초기화
      setIsSubmitting(false)
      setError('')
    }
  }

  return (
    <main className={css.createpost}>
      <h2 className={css.postTitle}>새 포스트 작성하기</h2>
      {/* 에러 메시지 표시 */}
      {error && <div className={css.error}>{error}</div>}

      {/* 글쓰기 폼 */}
      <form className={css.writecon} onSubmit={handleCreatePost}>
        {/* 제목 입력 */}
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* 요약내용 입력 */}
        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          name="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />

        {/* 이미지 파일 업로드 */}
        <label htmlFor="files">파일</label>
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />

        {/* 에디터로 본문 내용 작성 */}
        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>

        {/* 제출 버튼 */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </form>
    </main>
  )
}
