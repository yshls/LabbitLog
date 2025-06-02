import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { SpeedInsights } from '@vercel/speed-insights/next'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SpeedInsights projectId="labbitlog">
        <RouterProvider router={router} />
      </SpeedInsights>
    </Provider>
  </StrictMode>
)
