import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { useAuthContext } from '@/features/auth/hooks/useAuthContext'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const RootRedirect = () => {
  const { token } = useAuthContext()
  return token ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />
}

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        {/* Authenticated users see 404, unauthenticated are redirected to login */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
