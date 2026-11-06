import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ApiError, listBooks, listGenres } from '../api/books'
import type { Book, BookStatus, SourceType } from '../api/types'
import BookCover from '../components/BookCover'
import ErrorMessage from '../components/ErrorMessage'
import RatingStars from '../components/RatingStars'
import { inputClass } from '../components/ui'
import { sourceLabels, statusLabels } from '../labels'

interface Props {
  /** Show only books with the status "Want to read". */
  wishList?: boolean
}

export default function LibraryPage({ wishList = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const genre = searchParams.get('genre') ?? ''
  const status = wishList ? 'WANT_TO_READ' : (searchParams.get('status') ?? '')
  const source = searchParams.get('source') ?? ''

  const [searchText, setSearchText] = useState(q)
  const [books, setBooks] = useState<Book[] | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function setParam(key: string, value: string) {
    setSearchParams(
      (params) => {
        if (value) params.set(key, value)
        else params.delete(key)
        return params
      },
      { replace: true },
    )
  }

  // Update the URL shortly after the user stops typing.
  useEffect(() => {
    const text = searchText.trim()
    if (text === q) return
    const timeout = setTimeout(() => {
      setSearchParams(
        (params) => {
          if (text) params.set('q', text)
          else params.delete('q')
          return params
        },
        { replace: true },
      )
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchText, q, setSearchParams])

  useEffect(() => {
    let ignore = false
    listBooks({
      q: q || undefined,
      genre: genre || undefined,
      status: (status || undefined) as BookStatus | undefined,
      source: (source || undefined) as SourceType | undefined,
    })
      .then((result) => {
        if (!ignore) {
          setBooks(result)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!ignore) setError(e instanceof ApiError ? e.message : 'The books could not be loaded.')
      })
    return () => {
      ignore = true
    }
  }, [q, genre, status, source])

  useEffect(() => {
    listGenres()
      .then(setGenres)
      .catch(() => setGenres([]))
  }, [])

  const filtered = Boolean(q || genre || source || (!wishList && status))

  return (
    <div>
      <h1 className="text-2xl font-semibold">{wishList ? 'Wish list' : 'Library'}</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          placeholder="Search title or author"
          aria-label="Search title or author"
          className={`${inputClass} lg:col-span-1`}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <select aria-label="Genre" className={inputClass} value={genre} onChange={(e) => setParam('genre', e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {!wishList && (
          <select aria-label="Status" className={inputClass} value={status} onChange={(e) => setParam('status', e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
        <select aria-label="Source" className={inputClass} value={source} onChange={(e) => setParam('source', e.target.value)}>
          <option value="">All sources</option>
          {Object.entries(sourceLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <ErrorMessage message={error} />
        {books && books.length === 0 && !error && (
          <p className="py-10 text-center text-muted">
            {filtered ? 'No books match the filters.' : wishList ? 'Your wish list is empty.' : 'No books yet.'}{' '}
            {!filtered && (
              <Link to="/books/new" className="text-accent hover:underline">
                Add your first book
              </Link>
            )}
          </p>
        )}
        {books && books.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <li key={book.id}>
                <BookCard book={book} wishList={wishList} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function BookCard({ book, wishList }: { book: Book; wishList: boolean }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="flex h-full gap-4 rounded-lg border border-border bg-surface p-4 hover:border-accent"
    >
      <BookCover url={book.coverUrl} title={book.title} className="h-32 w-22 shrink-0 rounded" />
      <div className="min-w-0 flex-1">
        <h2 className="font-medium leading-snug">{book.title}</h2>
        {book.authors.length > 0 && <p className="mt-1 text-sm text-muted">{book.authors.join(', ')}</p>}
        <p className="mt-2 text-xs text-muted">
          {statusLabels[book.status]}
          {book.status === 'READING' && book.currentPage != null && (
            <> · page {book.currentPage}{book.pageCount ? ` of ${book.pageCount}` : ''}</>
          )}
        </p>
        {book.status === 'READ' && (
          <div className="mt-1 text-sm">
            <RatingStars rating={book.rating} />
          </div>
        )}
        {wishList && book.wishReason && <p className="mt-2 line-clamp-2 text-sm">{book.wishReason}</p>}
        {wishList && book.recommendedBy && (
          <p className="mt-1 text-xs text-muted">Recommended: {book.recommendedBy}</p>
        )}
      </div>
    </Link>
  )
}
