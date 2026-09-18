import type { ReactNode } from 'react'

export function ChartCard({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return <section className="chart-card"><header><strong>{title}</strong>{right}</header>{children}</section>
}
