export function Sparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const min = Math.min(...data), max = Math.max(...data)
  const points = data.map((v, i) => {
    const x = (i/(data.length-1))*100
    const y = 100 - ((v-min)/(max-min || 1))*78 - 10
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke={positive ? '#38e58c' : '#ff5d78'} strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
