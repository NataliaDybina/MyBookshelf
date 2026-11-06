import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError, deleteBook, getBook } from '../api/books'
import type { Book } from '../api/types'
import BookCover from '../components/BookCover'
import ConfirmModal from '../components/ConfirmModal'
import ErrorMessage from '../components/ErrorMessage'
import RatingStars from '../components/RatingStars'
import { primaryButtonClass, secondaryButtonClass } from '../components/ui'
import { formatDate, formatLabels, sourceFromLabels, sourceLabels, statusLabels } from '../labels'

export default function BookDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false
    getBook(id)
      .then((result) => {
        if (!ignore) setBook(result)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(e instanceof ApiError ? e.message : 'The book could not be loaded.')
      })
    return () => {
      ignore = true
    }
  }, [id])

  const closeModal = useCallback(() => setConfirmDelete(false), [])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBook(id)
      navigate('/', { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The book could not be deleted.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (!book) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        {error && (
          <Link to="/" className="text-accent hover:underline">
            Back to the library
          </Link>
        )}
      </div>
    )
  }

  const { source } = book

  return (
    <article>
      <ErrorMessage message={error} />
      <div className="mt-4 flex flex-col gap-8 sm:flex-row">
        <BookCover url={book.coverUrl} title={book.title} className="h-72 w-48 shrink-0 rounded-lg shadow" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold">{book.title}</h1>
          {book.authors.length > 0 && <p className="mt-1 text-lg text-muted">{book.authors.join(', ')}</p>}
          {book.genres.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {book.genres.map((genre) => (
                <li key={genre}>
                  <Link
                    to={`/?genre=${encodeURIComponent(genre)}`}
                    className="rounded-full bg-border/60 px-3 py-1 text-xs hover:bg-border"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
            <Field label="Status">
              {statusLabels[book.status]}
              {book.currentPage != null && book.status !== 'WANT_TO_READ' && (
                <span className="text-muted">
                  {' '}
                  · page {book.currentPage}
                  {book.pageCount ? ` of ${book.pageCount}` : ''}
                </span>
              )}
            </Field>
            {book.rating != null && (
              <Field label="Rating">
                <RatingStars rating={book.rating} />
              </Field>
            )}
            {book.format && <Field label="Format">{formatLabels[book.format]}</Field>}
            {book.pageCount != null && <Field label="Pages">{book.pageCount}</Field>}
            <Field label="Source">
              {sourceLabels[source.type]}
              {source.from && <span className="text-muted"> · {sourceFromLabels[source.type]}: {source.from}</span>}
              {source.type !== 'OWN' && (
                <span className={source.returned ? 'text-muted' : 'text-accent'}>
                  {' '}
                  · {source.returned ? 'returned' : 'not returned'}
                </span>
              )}
            </Field>
            <Field label="Added">{formatDate(book.addedAt)}</Field>
            {book.finishedAt && <Field label="Finished">{formatDate(book.finishedAt)}</Field>}
          </dl>

          <div className="mt-6 flex gap-3">
            <Link to={`/books/${book.id}/edit`} className={primaryButtonClass}>
              Edit
            </Link>
            <button type="button" className={secondaryButtonClass} onClick={() => setConfirmDelete(true)}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <TextSection title="My review" text={book.review} />
      <TextSection title="Why I want to read it" text={book.wishReason} />
      <TextSection title="Where I saw it / recommended by" text={book.recommendedBy} />
      <TextSection title="Description" text={book.description} />

      {confirmDelete && (
        <ConfirmModal
          title="Delete book?"
          message={`"${book.title}" and your review will be deleted permanently. This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </article>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd>{children}</dd>
    </>
  )
}

function TextSection({ title, text }: { title: string; text: string | null }) {
  if (!text) return null
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 whitespace-pre-line leading-relaxed">{text}</p>
    </section>
  )
}
