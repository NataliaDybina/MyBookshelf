interface Props {
  message: string | null
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null
  return (
    <div role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">
      {message}
    </div>
  )
}
