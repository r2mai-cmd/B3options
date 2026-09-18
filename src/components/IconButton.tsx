import type { ReactNode } from 'react'

export function IconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  return <button className="icon-btn" aria-label={label} title={label} onClick={onClick}>{children}</button>
}
