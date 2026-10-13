const WIDTH = 240;
const HEIGHT = 52;

export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <div className="mu">Se necesitan 2 registros para ver la tendencia.</div>;
  }
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values.map((value, i): [number, number] => [
    (i * WIDTH) / (values.length - 1),
    HEIGHT - 6 - ((value - min) / range) * (HEIGHT - 14),
  ]);

  return (
    <svg className="spark" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label="Tendencia">
      <polyline
        fill="none"
        stroke="var(--pr)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.map((p) => p.join(",")).join(" ")}
      />
      {points.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3.5} fill="var(--pr)" />
      ))}
    </svg>
  );
}
