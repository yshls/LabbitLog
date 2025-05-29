import { Link } from 'react-router-dom'

export const MenuLike = ({ to, label, children }) => {
  return (
    <Link to={to} className="menu-link">
      {children}
      <span>{label}</span>
    </Link>
  )
}
