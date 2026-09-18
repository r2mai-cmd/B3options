import { useMemo, useState } from 'react'
import { Activity, Bell, BookOpen, CalendarDays, ChevronDown, CircleHelp, Filter, Grid2X2, Heart, LineChart as LineIcon, Menu, Moon, Search, Settings2, SlidersHorizontal, Star, Table2, TrendingUp, X } from 'lucide-react'
import { assets, historyFor, optionChain } from './data/mockData'
import type { Asset } from './types'
import { AssetCard } from './components/AssetCard'
import { Metric } from './components/Metric'
import { IVHVChart, RankChart, DistributionChart, StrikeChart, TermChart, SkewChart } from './components/Charts'
import { OptionTable } from './components/OptionTable'

type Tab = 'overview'|'options'|'vol'|'greeks'|'skew'|'flow'

function App() {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('Todos')
  const [sort, setSort] = useState<keyof Asset>('ivRank')
  const [minRank, setMinRank] = useState(false)
  const [selected, setSelected] = useState<Asset>(assets[0])
  const [tab, setTab] = useState<Tab>('overview')
  const [view, setView] = useState<'cards'|'table'>('cards')
  const [favorites, setFavorites] = useState<string[]>(['PETR4'])
  const [showFilters, setShowFilters] = useState(false)
  const [watchOnly, setWatchOnly] = useState(false)

  const sectors = ['Todos', ...Array.from(new Set(assets.map(a => a.sector)))]
  const filtered = useMemo(() => assets.filter(a =>
    (!query || `${a.ticker} ${a.name}`.toLowerCase().includes(query.toLowerCase())) &&
    (sector === 'Todos' || a.sector === sector) &&
    (!minRank || a.ivRank > 70) &&
    (!watchOnly || favorites.includes(a.ticker))
  ).sort((a,b) => Number(b[sort]) - Number(a[sort])), [query, sector, minRank, sort, watchOnly, favorites])
  const history = historyFor(selected)

  const toggleFavorite = (ticker:string) => setFavorites(f => f.includes(ticker) ? f.filter(x=>x!==ticker) : [...f,ticker])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="brand-mark">↗</div><div><strong>B3Vol</strong><span>Opções em dados. Decisões em contexto.</span></div></div>
        <nav className="main-nav">
          {['Dashboard','Scanner','Opções','Volatilidade','Calendário','Aprenda'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}
        </nav>
        <div className="top-actions"><div className="global-search"><Search size={15}/><input placeholder="Buscar ativo (ex.: PETR4)" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="round"><Moon size={16}/></button><div className="avatar">U</div></div>
      </header>

      <div className="tickerbar"><span>IBOV <b>131.842</b> <em className="up">+0,72%</em></span><span>WINV24 <b>132.015</b> <em className="up">+0,81%</em></span><span>DÓLAR <b>5,47</b> <em className="up">+0,34%</em></span><div className="market-status">Dados atualizados: 18/09/2026 17:32 (BRT) <i/> Mercado aberto</div></div>

      <main className="main">
        <section className="page-head">
          <div><h1>Scanner de Volatilidade</h1><p>Ações da B3 com os principais indicadores de volatilidade das opções</p></div>
          <div className="headline-stats"><div><b>342</b><span>Ativos analisados</span></div><div><b className="green">128</b><span>Com IV Rank &gt; 70</span></div><div><b className="blue">62</b><span>IV/HV &gt; 1,2</span></div><div><b className="green">R$ 1,8B</b><span>Volume em opções (hoje)</span></div></div>
        </section>

        <section className="toolbar">
          <button className="filter-chip active" onClick={()=>{setMinRank(false);setWatchOnly(false)}}>Todos</button>
          <button className={`filter-chip ${minRank?'active':''}`} onClick={()=>setMinRank(v=>!v)}>IV Rank &gt; 70</button>
          <button className="filter-chip">IV/HV &gt; 1.2</button>
          <button className="filter-chip">Alta Liquidez</button>
          <label className="select-wrap"><select value={sector} onChange={e=>setSector(e.target.value)}>{sectors.map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={14}/></label>
          <button className={`filter-chip ${showFilters?'active':''}`} onClick={()=>setShowFilters(v=>!v)}><SlidersHorizontal size={14}/> Mais filtros</button>
          <div className="toolbar-search"><Search size={15}/><input placeholder="Buscar ativo..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
          <label className="select-wrap sort">Ordenar por <select value={sort} onChange={e=>setSort(e.target.value as keyof Asset)}><option value="ivRank">IV Rank (maior → menor)</option><option value="ivhv">IV/HV</option><option value="iv">IV</option><option value="volume">Volume</option><option value="percentile">Percentil</option></select><ChevronDown size={14}/></label>
          <div className="view-toggle"><button className={view==='cards'?'active':''} onClick={()=>setView('cards')}><Grid2X2 size={14}/> Cards</button><button className={view==='table'?'active':''} onClick={()=>setView('table')}><Table2 size={14}/> Tabela</button></div>
        </section>

        {showFilters && <div className="advanced-filters"><div><span>IV Rank</span><b>0 — 100</b></div><div><span>DTE</span><b>7 — 180 dias</b></div><div><span>Volume mínimo</span><b>R$ 100K</b></div><div><span>Delta</span><b>0,10 — 0,70</b></div><div><span>Liquidez</span><b>Spread &lt; 5%</b></div><button onClick={()=>setShowFilters(false)}><X size={14}/></button></div>}

        <div className="content-grid">
          <section>
            <div className="section-label"><span>{watchOnly ? 'Minha Watchlist' : 'Ativos'}</span><button onClick={()=>setWatchOnly(v=>!v)} className={watchOnly?'link-active':''}><Heart size={14} fill={watchOnly?'currentColor':'none'}/> Watchlist ({favorites.length})</button></div>
            {view==='cards' ? <div className="cards-grid">{filtered.map(a=><AssetCard key={a.ticker} asset={a} selected={selected.ticker===a.ticker} onClick={()=>{setSelected(a);setTab('overview')}} favorite={favorites.includes(a.ticker)} onFavorite={()=>toggleFavorite(a.ticker)}/>)}</div> :
              <div className="table-card"><table className="scanner-table"><thead><tr><th>Ativo</th><th>Preço</th><th>IV</th><th>HV30</th><th>IV/HV</th><th>IV Rank</th><th>Percentil</th><th>Volume</th></tr></thead><tbody>{filtered.map(a=><tr key={a.ticker} onClick={()=>setSelected(a)}><td><b>{a.ticker}</b><small>{a.name}</small></td><td>R$ {a.price.toFixed(2)}</td><td>{a.iv.toFixed(1)}%</td><td>{a.hv30.toFixed(1)}%</td><td>{a.ivhv.toFixed(2)}x</td><td className="rank">{a.ivRank.toFixed(1)}</td><td className="pct">{a.percentile}%</td><td>R$ {a.volume.toFixed(1)}M</td></tr>)}</tbody></table></div>}
          </section>

          <aside className="rankings">
            <Ranking title="Maiores IV Rank" rows={assets.slice().sort((a,b)=>b.ivRank-a.ivRank).slice(0,5)} metric="ivRank"/>
            <Ranking title="Maiores IV/HV" rows={assets.slice().sort((a,b)=>b.ivhv-a.ivhv).slice(0,5)} metric="ivhv"/>
            <Ranking title="Maiores Volumes (Opções)" rows={assets.slice().sort((a,b)=>b.volume-a.volume).slice(0,5)} metric="volume"/>
          </aside>
        </div>

        <section className="detail-panel">
          <header className="detail-head">
            <div className="detail-title"><div className="ticker-mark big">{selected.ticker.slice(0,2)}</div><div><h2>{selected.ticker}</h2><span>{selected.name}</span></div><button className="star detail-star" onClick={()=>toggleFavorite(selected.ticker)}><Star size={17} fill={favorites.includes(selected.ticker)?'currentColor':'none'}/></button></div>
            <div className="detail-price"><b>R$ {selected.price.toFixed(2).replace('.', ',')}</b><span className={selected.change>=0?'up':'down'}>{selected.change>=0?'+':''}{selected.change.toFixed(2).replace('.', ',')}%</span><small>Atualizado: 18/09 17:32</small></div>
            <div className="detail-actions"><button><Activity size={14}/> Comparar</button><button><Heart size={14}/> Adicionar à carteira</button></div>
          </header>
          <nav className="detail-tabs">{([
            ['overview','Visão Geral'],['options','Opções'],['vol','Volatilidade'],['greeks','Gregas'],['skew','Skew e Term Structure'],['flow','Fluxo'],['news','Notícias']
          ] as [string,string][]).map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id as Tab)}>{label}</button>)}</nav>

          {tab==='overview' && <div className="detail-body">
            <div className="summary-card"><h3>Resumo</h3><dl><dt>Preço</dt><dd>{selected.price.toFixed(2)}</dd><dt>Variação</dt><dd className={selected.change>=0?'up':'down'}>{selected.change>=0?'+':''}{selected.change.toFixed(2)}%</dd><dt>IV (ATM)</dt><dd>{selected.iv.toFixed(1)}%</dd><dt>HV 30D</dt><dd>{selected.hv30.toFixed(1)}%</dd><dt>IV/HV</dt><dd>{selected.ivhv.toFixed(2)}x</dd><dt>IV Rank (1 ano)</dt><dd className="rank">{selected.ivRank.toFixed(1)}</dd><dt>IV Percentil (1 ano)</dt><dd className="pct">{selected.percentile}%</dd><dt>Máx IV (1 ano)</dt><dd>48,7%</dd><dt>Mín IV (1 ano)</dt><dd>16,2%</dd><dt>Volume opções (hoje)</dt><dd>R$ {selected.volume.toFixed(1)}M</dd><dt>Open Interest</dt><dd>{selected.oi.toFixed(1)}M</dd><dt>Dividend yield</dt><dd>12,4%</dd></dl></div>
            <div className="charts-main"><div className="chart-row"><IVHVChart data={history}/><RankChart data={history}/><DistributionChart data={history}/></div><div className="chart-row"><StrikeChart/><TermChart/><SkewChart/></div></div>
          </div>}

          {tab==='options' && <div className="tab-body"><div className="sub-toolbar"><div><b>Cadeia de opções</b><span>PETR4 · 16/10/2026 · 28 DTE</span></div><div className="segmented"><button className="active">Todas</button><button>Calls</button><button>Puts</button></div><button className="filter-chip"><Filter size={14}/> Filtros</button></div><OptionTable rows={optionChain}/></div>}

          {tab==='vol' && <div className="tab-body"><div className="chart-row"><IVHVChart data={history}/><RankChart data={history}/></div><div className="chart-row"><DistributionChart data={history}/><TermChart/></div></div>}
          {tab==='greeks' && <div className="tab-body"><div className="greek-grid">{[['Delta','Sensibilidade ao preço do ativo','0,52'],['Gamma','Variação do Delta','0,041'],['Theta','Decaimento temporal','-0,082'],['Vega','Sensibilidade à IV','0,114'],['Rho','Sensibilidade à taxa','0,021'],['Elasticidade','Variação % vs ativo','1,86x']].map(x=><div className="greek-card" key={x[0]}><span>{x[0]}</span><b>{x[2]}</b><small>{x[1]}</small></div>)}</div><OptionTable rows={optionChain.slice(0,10)}/></div>}
          {tab==='skew' && <div className="tab-body"><div className="chart-row"><StrikeChart/><TermChart/></div><div className="chart-row"><SkewChart/><DistributionChart data={history}/></div></div>}
          {tab==='flow' && <div className="tab-body"><div className="flow-grid"><Metric label="Volume Calls" value="R$ 238,4M" tone="green"/><Metric label="Volume Puts" value="R$ 173,9M" tone="red"/><Metric label="Put/Call Volume" value="0,73x" tone="blue"/><Metric label="OI total" value="8,4M" tone="purple"/></div><OptionTable rows={optionChain.slice().sort((a,b)=>b.volume-a.volume).slice(0,12)}/></div>}
          {tab==='news' && <div className="tab-body news-list">{['Resultados trimestrais e expectativas','Dividendos e datas de corte','Fatos relevantes e comunicados','Eventos corporativos próximos'].map((n,i)=><div className="news-row" key={n}><div className="news-icon"><Bell size={16}/></div><div><b>{n}</b><p>Área preparada para integração com calendário e notícias de mercado.</p></div><span>{i+1} itens</span></div>)}</div>}
        </section>
      </main>

      <footer><span>B3Vol · Terminal de volatilidade</span><span>Dados demonstrativos · Conecte sua fonte de mercado antes de usar em produção.</span></footer>
    </div>
  )
}

function Ranking({ title, rows, metric }: { title:string; rows:Asset[]; metric:keyof Asset }) {
  return <section className="ranking-card"><header><b>{title}</b><button>Ver todos →</button></header>{rows.map((a,i)=><div className="rank-row" key={a.ticker}><span className="rank-num">{i+1}</span><b>{a.ticker}</b><div className="rank-bar"><i style={{width:`${Math.min(100, Number(a[metric]) / (metric==='ivRank'?1:metric==='ivhv'?2.5:5)*100)}%`}}/></div><strong>{metric==='ivhv' ? `${Number(a[metric]).toFixed(2)}x` : metric==='volume' ? `R$ ${Number(a[metric]).toFixed(1)}M` : Number(a[metric]).toFixed(1)}</strong></div>)}</section>
}

export default App
