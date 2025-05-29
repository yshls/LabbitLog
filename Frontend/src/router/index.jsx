import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePost } from '../pages/CreatePost'
import { PostListPage } from '../pages/PostListPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { EditePost } from '../pages/EditePost'
import { MyPage } from '../pages/MyPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: <PostListPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'createPost',
        element: <CreatePost />,
      },
      {
        path: 'detail/:postId',
        element: <PostDetailPage />,
      },
      {
        path: 'edit/:postId',
        element: <EditePost />,
      },
      {
        path: 'mypage/:username', // ✅ 여기가 포인트!!
        element: <MyPage />,
      },
    ],
  },
])
