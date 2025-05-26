import { useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
// import './QuillEditor.css'
/** useRef 사용 이유
변하지 않는 값을 저장하거나 DOM에 직접 접근 할때 사용 여기서는 자동 텍스트 삽입 같은 기능으로 인해 useRef 사용 */

const QuillEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null)

  // Quill 에디터 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  }
  return (
    <div className="quill-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || '내용을 입력해 주세요'}
      />
    </div>
  )
}

export default QuillEditor
