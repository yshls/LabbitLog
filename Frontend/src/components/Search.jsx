import { FiSearch } from 'react-icons/fi'
import css from './search.module.css'

export const Search = ({ value, onChange, placeholder = '검색어를 입력하세요' }) => {
  return (
    <div className={css.searchbar}>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
      <FiSearch className={css.icon} />
    </div>
  )
}
