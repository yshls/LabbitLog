import spinner from '../assets/spinner.gif'
import css from './LoadingSpinner.module.css'
export default function LoadingSpinner() {
  return (
    <div className={css.spinnerWrapper}>
      <img src={spinner} alt="로딩 중" className={css.spinner} />
    </div>
  )
}
