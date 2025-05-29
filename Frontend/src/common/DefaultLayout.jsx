import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'
import { Toaster } from 'react-hot-toast'

export const DefaultLayout = () => {
  return (
    <div className={css.defaultlayout}>
      <Header />
      <Outlet />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '50px',
          },
        }}
      />
    </div>
  )
}
