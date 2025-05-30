import spinner from '../assets/spinner.gif'
import css from './LoadingSpinner.module.css' // 스타일 분리하고 싶으면

export default function LoadingSpinner() {
  return (
    <div className={css.spinnerWrapper}>
      <img src={spinner} alt="로딩 중" className={css.spinner} />
    </div>
  )
}
