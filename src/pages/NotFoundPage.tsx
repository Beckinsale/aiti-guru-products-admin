import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-7xl font-bold text-violet-600 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Страница не найдена</h1>
      <p className="text-sm text-gray-500 mb-6">Такой страницы не существует</p>
      <Link
        to="/products"
        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm
          font-medium rounded-lg transition"
      >
        На главную
      </Link>
    </div>
  </div>
)

export default NotFoundPage
