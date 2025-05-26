import css from './createpost.module.css'
import { useState, useEffect } from 'react'
import QuillEditor from '../components/QuillEditor'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
//
import { createPost } from '../apis/postApi'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const user = useSelector(state => state.user.user)
  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleContentChange = content => {
    setContent(content)
  }

  const handleCreatePost = async e => {
    e.preventDefault()

    setIsSubmitting(true)
    setError('')

    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('모든 필드를 입력해주세요')
      return
    }

    // 백엔드로 전송할 데이터 생성
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)

    if (files[0]) {
      data.set('files', files[0])
    }

    try {
      await createPost(data)
      console.log('등록성공')

      setIsSubmitting(false)
      navigate('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }
  return (
    <main className={css.createpost}>
      <h2>글쓰기</h2>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleCreatePost}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          name="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <label htmlFor="files">파일</label>
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />
        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
        <div>test</div>
      </form>
    </main>
  )
}
