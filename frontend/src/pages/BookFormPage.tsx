import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError, createBook, getBook, updateBook } from '../api/books'
import type { Book, BookFormat, BookRequest, BookStatus, SourceType } from '../api/types'
import ErrorMessage from '../components/ErrorMessage'
import { inputClass, primaryButtonClass, secondaryButtonClass } from '../components/ui'
import { formatLabels, sourceFromLabels, sourceLabels, statusLabels } from '../labels'

/** Form state: text inputs hold strings, converted to the request on submit. */
interface FormState {
  title: string
  authors: string
  coverUrl: string
  description: string
  genres: string
  catalogId: string
  status: BookStatus
  currentPage: string
  pageCount: string
  format: BookFormat | ''
  rating: string
  review: string
  sourceType: SourceType
  sourceFrom: string
  returned: boolean
  wishReason: string
  recommendedBy: string
  finishedAt: string
}

const emptyForm: FormState = {
  title: '',
  authors: '',
  coverUrl: '',
  description: '',
  genres: '',
  catalogId: '',
  status: 'WANT_TO_READ',
  currentPage: '',
  pageCount: '',
  format: 'PAPER',
  rating: '',
  review: '',
  sourceType: 'OWN',
  sourceFrom: '',
  returned: false,
  wishReason: '',
  recommendedBy: '',
  finishedAt: '',
}

function toForm(book: Book): FormState {
  return {
    title: book.title,
    authors: book.authors.join(', '),
    coverUrl: book.coverUrl ?? '',
    description: book.description ?? '',
    genres: book.genres.join(', '),
    catalogId: book.catalogId ?? '',
    status: book.status,
    currentPage: book.currentPage?.toString() ?? '',
    pageCount: book.pageCount?.toString() ?? '',
    format: book.format ?? '',
    rating: book.rating?.toString() ?? '',
    review: book.review ?? '',
    sourceType: book.source.type,
    sourceFrom: book.source.from ?? '',
    returned: book.source.returned,
    wishReason: book.wishReason ?? '',
    recommendedBy: book.recommendedBy ?? '',
    finishedAt: book.finishedAt ?? '',
  }
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function toRequest(form: FormState): BookRequest {
  const borrowedOrLibrary = form.sourceType !== 'OWN'
  return {
    title: form.title,
    authors: splitList(form.authors),
    coverUrl: form.coverUrl || null,
    description: form.description || null,
    genres: splitList(form.genres),
    catalogId: form.catalogId || null,
    status: form.status,
    currentPage: toNumber(form.currentPage),
    pageCount: toNumber(form.pageCount),
    format: form.format || null,
    rating: toNumber(form.rating),
    review: form.review || null,
    source: {
      type: form.sourceType,
      from: borrowedOrLibrary ? form.sourceFrom || null : null,
      returned: borrowedOrLibrary && form.returned,
    },
    wishReason: form.wishReason || null,
    recommendedBy: form.recommendedBy || null,
    finishedAt: form.finishedAt || null,
  }
}

export default function BookFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [loaded, setLoaded] = useState(!editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!id) return
    let ignore = false
    getBook(id)
      .then((book) => {
        if (!ignore) {
          setForm(toForm(book))
          setLoaded(true)
        }
      })
      .catch((e: unknown) => {
        if (!ignore) setError(e instanceof ApiError ? e.message : 'The book could not be loaded.')
      })
    return () => {
      ignore = true
    }
  }, [id])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})
    try {
      const request = toRequest(form)
      const saved = id ? await updateBook(id, request) : await createBook(request)
      navigate(`/books/${saved.id}`, { replace: editing })
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
        setFieldErrors(e.fieldErrors)
      } else {
        setError('The book could not be saved.')
      }
      setSaving(false)
    }
  }

  if (!loaded) {
    return <ErrorMessage message={error} />
  }

  const cancelTo = id ? `/books/${id}` : '/'

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8" noValidate>
      <h1 className="text-2xl font-semibold">{editing ? 'Edit book' : 'Add book'}</h1>
      <ErrorMessage message={error} />

      <Section title="Book">
        <Field label="Title" error={fieldErrors.title} wide>
          <input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} required autoFocus />
        </Field>
        <Field label="Authors" hint="Separate several authors with commas" error={fieldErrors.authors} wide>
          <input className={inputClass} value={form.authors} onChange={(e) => update('authors', e.target.value)} />
        </Field>
        <Field label="Genres" hint="Separate several genres with commas" error={fieldErrors.genres} wide>
          <input className={inputClass} value={form.genres} onChange={(e) => update('genres', e.target.value)} />
        </Field>
        <Field label="Cover image URL" error={fieldErrors.coverUrl} wide>
          <input className={inputClass} type="url" value={form.coverUrl} onChange={(e) => update('coverUrl', e.target.value)} />
        </Field>
        <Field label="Format" error={fieldErrors.format}>
          <select className={inputClass} value={form.format} onChange={(e) => update('format', e.target.value as BookFormat | '')}>
            <option value="">—</option>
            {Object.entries(formatLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Number of pages" error={fieldErrors.pageCount}>
          <input className={inputClass} type="number" min={1} value={form.pageCount} onChange={(e) => update('pageCount', e.target.value)} />
        </Field>
        <Field label="Description" error={fieldErrors.description} wide>
          <textarea className={inputClass} rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </Field>
      </Section>

      <Section title="Reading">
        <Field label="Status" error={fieldErrors.status}>
          <select className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value as BookStatus)}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        {form.status !== 'WANT_TO_READ' && (
          <Field label="Current page" error={fieldErrors.currentPage}>
            <input className={inputClass} type="number" min={0} value={form.currentPage} onChange={(e) => update('currentPage', e.target.value)} />
          </Field>
        )}
        {form.status === 'READ' && (
          <>
            <Field label="Finished on" hint="Empty: today" error={fieldErrors.finishedAt}>
              <input className={inputClass} type="date" value={form.finishedAt} onChange={(e) => update('finishedAt', e.target.value)} />
            </Field>
            <Field label="Rating" error={fieldErrors.rating}>
              <select className={inputClass} value={form.rating} onChange={(e) => update('rating', e.target.value)}>
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {'★'.repeat(value)}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        <Field label="My review" error={fieldErrors.review} wide>
          <textarea className={inputClass} rows={5} value={form.review} onChange={(e) => update('review', e.target.value)} />
        </Field>
      </Section>

      <Section title="Source">
        <Field label="Where the book came from" error={fieldErrors['source.type']}>
          <select className={inputClass} value={form.sourceType} onChange={(e) => update('sourceType', e.target.value as SourceType)}>
            {Object.entries(sourceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        {form.sourceType !== 'OWN' && (
          <>
            <Field label={sourceFromLabels[form.sourceType]} error={fieldErrors['source.from']}>
              <input className={inputClass} value={form.sourceFrom} onChange={(e) => update('sourceFrom', e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={form.returned} onChange={(e) => update('returned', e.target.checked)} />
              Returned
            </label>
          </>
        )}
      </Section>

      <Section title="Wish list">
        <Field label="Why I want to read it" error={fieldErrors.wishReason} wide>
          <textarea className={inputClass} rows={3} value={form.wishReason} onChange={(e) => update('wishReason', e.target.value)} />
        </Field>
        <Field label="Where I saw it / recommended by" error={fieldErrors.recommendedBy} wide>
          <input className={inputClass} value={form.recommendedBy} onChange={(e) => update('recommendedBy', e.target.value)} />
        </Field>
      </Section>

      <div className="flex gap-3">
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <Link to={cancelTo} className={secondaryButtonClass}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-border bg-surface p-5">
      <legend className="px-1 font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  wide?: boolean
  children: ReactNode
}

function Field({ label, hint, error, wide = false, children }: FieldProps) {
  return (
    <label className={`block text-sm ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
}
