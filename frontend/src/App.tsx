import { Link, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import BookDetailsPage from './pages/BookDetailsPage'
import BookFormPage from './pages/BookFormPage'
import LibraryPage from './pages/LibraryPage'

function NotFoundPage() {
  return (
    <div className="py-10 text-center">
      <p className="text-muted">This page does not exist.</p>
      <Link to="/" className="mt-2 inline-block text-accent hover:underline">
        Back to the library
      </Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LibraryPage />} />
        <Route path="wishlist" element={<LibraryPage wishList />} />
        <Route path="books/new" element={<BookFormPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="books/:id/edit" element={<BookFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
