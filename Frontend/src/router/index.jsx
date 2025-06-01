import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePost } from '../pages/CreatePost'
import { PostListPage } from '../pages/PostListPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { EditePost } from '../pages/EditePost'
import { MyPage } from '../pages/MyPage'
import { UserInfoUpdate } from '../pages/UserInfoUpdate'

export const router = createBrowserRouter([
  // 회원가입, 로그인은 단독 경로 (공통 레이아웃 X)
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },

  // 나머지 페이지는 공통 레이아웃 안에서 렌더링
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
        path: 'mypage/:username',
        element: <MyPage />,
      },
      {
        path: 'update-profile',
        element: <UserInfoUpdate />,
      },
    ],
  },
])
