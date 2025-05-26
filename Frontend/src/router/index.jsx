import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePost } from '../pages/CreatePost'
import PostCard from '../components/PostCard'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: (
          <div>
            <h1>블로그 리스트</h1>
            <PostCard />
            <PostCard />
            <PostCard />
          </div>
        ),
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/createPost',
        element: <CreatePost />,
      },
    ],
  },
])
