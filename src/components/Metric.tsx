export function Metric({ label, value, tone = 'neutral', sub }: { label: string; value: string; tone?: 'green'|'red'|'purple'|'blue'|'neutral'; sub?: string }) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <strong className={`metric-value ${tone}`}>{value}</strong>
      {sub && <span className="metric-sub">{sub}</span>}
    </div>
  )
}
