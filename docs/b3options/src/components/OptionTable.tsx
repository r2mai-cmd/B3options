import type { OptionRow } from '../types'

export function OptionTable({ rows }: { rows: OptionRow[] }) {
  return <div className="table-scroll"><table className="option-table"><thead><tr><th>Opção</th><th>Tipo</th><th>Strike</th><th>Bid</th><th>Ask</th><th>Last</th><th>IV</th><th>Delta</th><th>Gamma</th><th>Theta</th><th>Vega</th><th>Volume</th><th>OI</th></tr></thead><tbody>
    {rows.map((o) => <tr key={o.symbol}><td><b>{o.symbol}</b><small>{o.expiry} · {o.dte}D</small></td><td><span className={`pill ${o.type.toLowerCase()}`}>{o.type}</span></td><td>{o.strike.toFixed(2)}</td><td>{o.bid.toFixed(2)}</td><td>{o.ask.toFixed(2)}</td><td>{o.last.toFixed(2)}</td><td><b>{o.iv.toFixed(1)}%</b></td><td>{o.delta.toFixed(2)}</td><td>{o.gamma.toFixed(3)}</td><td>{o.theta.toFixed(3)}</td><td>{o.vega.toFixed(3)}</td><td>{o.volume.toLocaleString('pt-BR')}</td><td>{o.oi.toLocaleString('pt-BR')}</td></tr>)}
  </tbody></table></div>
}
