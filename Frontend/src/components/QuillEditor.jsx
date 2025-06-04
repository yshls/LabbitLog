import { useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import '../components/QuilEditor.css'

/**
 * QuillEditor 컴포넌트
 * - 리치 텍스트 에디터 역할 수행
 * - useRef: 에디터 DOM 접근이나 API 사용 용도
 * - value, onChange: 상위 컴포넌트에서 상태 제어
 * - placeholder: 입력 안내 문구 (기본값 설정)
 */
const QuillEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null) // 에디터 인스턴스 접근용 ref

  // Quill 에디터 툴바 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }], // 헤더 크기 선택
        ['bold', 'italic', 'underline', 'strike'], // 굵기, 기울임, 밑줄, 취소선
        [{ list: 'ordered' }, { list: 'bullet' }], // 순서있는 목록, 순서없는 목록
        ['link', 'image'], // 링크, 이미지 삽입 버튼
        ['clean'], // 서식 제거 버튼
      ],
    },
  }

  return (
    <div className="quill-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow" // 스노우 테마 적용
        value={value} // 에디터 내용 (상위 상태 연동)
        onChange={onChange} // 내용 변경시 콜백
        modules={modules} // 툴바 설정
        placeholder={placeholder || '내용을 입력해 주세요'} // 기본 안내 문구
      />
    </div>
  )
}

export default QuillEditor
