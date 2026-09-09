type RatingProps = {
  value: number;
  max?: number;
};

export default function Rating({ value, max = 10 }: RatingProps) {
  return <span aria-label={`Rating ${value} out of ${max}`}>{value.toFixed(1)} / {max}</span>;
}
