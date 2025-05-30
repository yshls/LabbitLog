import { FiSearch } from 'react-icons/fi'
import css from './search.module.css'

export const Search = ({ value, onChange, placeholder = '검색' }) => {
  return (
    <div className={css.searchbar}>
      <FiSearch className={css.icon} />
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}
