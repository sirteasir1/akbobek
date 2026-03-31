export function Sparkline({ values }: { values: number[] }) {
  const width = 180;
  const height = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} />
    </svg>
  );
}
