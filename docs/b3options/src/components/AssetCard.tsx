import { Star } from 'lucide-react'
import type { Asset } from '../types'
import { Sparkline } from './Sparkline'

export function AssetCard({ asset, selected, onClick, favorite, onFavorite }: { asset: Asset; selected: boolean; onClick: () => void; favorite: boolean; onFavorite: () => void }) {
  return (
    <article className={`asset-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <header className="asset-card-head">
        <div className="ticker-mark">{asset.ticker.slice(0,2)}</div>
        <div className="asset-title"><strong>{asset.ticker}</strong><span>{asset.name}</span></div>
        <div className="asset-price"><strong>R$ {asset.price.toFixed(2).replace('.', ',')}</strong><span className={asset.change >= 0 ? 'up' : 'down'}>{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2).replace('.', ',')}%</span></div>
        <button className="star" onClick={(e) => { e.stopPropagation(); onFavorite() }} aria-label="Favoritar">
          <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </header>
      <div className="metrics-grid">
        <div><span>IV</span><b>{asset.iv.toFixed(1)}%</b></div>
        <div><span>HV30</span><b>{asset.hv30.toFixed(1)}%</b></div>
        <div><span>IV/HV</span><b>{asset.ivhv.toFixed(2)}x</b></div>
        <div><span>IV Rank</span><b className="rank">{asset.ivRank.toFixed(1)}</b></div>
        <div><span>Percentil</span><b className="pct">{asset.percentile}%</b></div>
        <div><span>Volume opções</span><b>R$ {asset.volume.toFixed(1)}M</b></div>
      </div>
      <div className="spark-wrap"><Sparkline data={asset.spark} positive={asset.change >= 0} /><span>252 dias</span></div>
    </article>
  )
}
