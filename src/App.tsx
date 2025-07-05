import { createBrowserRouter, RouterProvider } from 'react-router'

import RequireAuth from './components/require-auth'
import UrlProvider from './context/url-provider'
import AppLayout from './layouts/app-layout'
import AuthPage from './pages/auth'
import DashboardPage from './pages/dashboard'
import LandingPage from './pages/landing'
import LinkPage from './pages/link'
import RedirectLink from './pages/redirect-link'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        )
      },
      {
        path: '/link/:id',
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        )
      },
      {
        path: '/:id',
        element: <RedirectLink />
      },
    ]
  }
])

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
