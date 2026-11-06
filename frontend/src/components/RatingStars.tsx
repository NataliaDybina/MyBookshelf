interface Props {
  rating: number | null
}

export default function RatingStars({ rating }: Props) {
  if (!rating) return null
  return (
    <span className="text-accent" aria-label={`Rating: ${rating} of 5`}>
      {'★'.repeat(rating)}
      <span className="text-border">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}
