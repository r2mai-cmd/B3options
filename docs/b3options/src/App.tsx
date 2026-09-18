import { useMemo, useState } from "react";

type Tab = "dashboard" | "scanner" | "watchlist" | "details" | "news";

type Stock = {
  ticker: string;
  name: string;
  price: number;
  iv: number;
  hv: number;
  ivRank: number;
  ivPercentile: number;
  skew: number;
  options: number;
  volume: string;
  oi: string;
  change: number;
  sector: string;
};

const stocks: Stock[] = [
  { ticker: "PETR4", name: "Petrobras PN", price: 38.42, iv: 31.8, hv: 24.7, ivRank: 82, ivPercentile: 91, skew: -5.4, options: 74, volume: "R$ 28,4M", oi: "1,82M", change: 1.72, sector: "Petróleo" },
  { ticker: "VALE3", name: "Vale ON", price: 63.18, iv: 27.4, hv: 23.1, ivRank: 68, ivPercentile: 77, skew: -3.1, options: 61, volume: "R$ 17,8M", oi: "1,21M", change: -0.42, sector: "Mineração" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", price: 42.67, iv: 22.1, hv: 19.8, ivRank: 54, ivPercentile: 63, skew: -2.8, options: 49, volume: "R$ 11,3M", oi: "2,08M", change: 0.86, sector: "Bancos" },
  { ticker: "BBDC4", name: "Bradesco PN", price: 16.84, iv: 24.6, hv: 21.4, ivRank: 61, ivPercentile: 71, skew: -4.2, options: 57, volume: "R$ 8,6M", oi: "1,64M", change: 1.08, sector: "Bancos" },
  { ticker: "PETR3", name: "Petrobras ON", price: 40.12, iv: 30.2, hv: 25.0, ivRank: 78, ivPercentile: 88, skew: -5.1, options: 63, volume: "R$ 7,4M", oi: "812K", change: 1.24, sector: "Petróleo" },
  { ticker: "BBAS3", name: "Banco do Brasil ON", price: 28.31, iv: 25.8, hv: 22.5, ivRank: 58, ivPercentile: 68, skew: -3.7, options: 43, volume: "R$ 6,9M", oi: "1,05M", change: -0.31, sector: "Bancos" },
  { ticker: "WEGE3", name: "WEG ON", price: 45.92, iv: 26.9, hv: 24.8, ivRank: 72, ivPercentile: 84, skew: -2.1, options: 38, volume: "R$ 5,1M", oi: "438K", change: 2.14, sector: "Indústria" },
  { ticker: "MGLU3", name: "Magazine Luiza ON", price: 8.74, iv: 48.2, hv: 43.7, ivRank: 89, ivPercentile: 96, skew: -8.7, options: 31, volume: "R$ 3,2M", oi: "792K", change: -2.48, sector: "Varejo" },
  { ticker: "B3SA3", name: "B3 ON", price: 13.58, iv: 23.7, hv: 20.9, ivRank: 49, ivPercentile: 57, skew: -3.4, options: 42, volume: "R$ 4,8M", oi: "1,31M", change: 0.55, sector: "Financeiro" },
  { ticker: "ABEV3", name: "Ambev ON", price: 13.02, iv: 19.4, hv: 17.8, ivRank: 36, ivPercentile: 44, skew: -1.9, options: 28, volume: "R$ 2,1M", oi: "601K", change: 0.18, sector: "Consumo" },
];

const expiries = [
  { label: "18 SET", days: 0, iv: 28.7 },
  { label: "17 OUT", days: 29, iv: 30.1 },
  { label: "21 NOV", days: 64, iv: 31.8 },
  { label: "19 DEZ", days: 92, iv: 32.5 },
  { label: "16 JAN", days: 120, iv: 33.2 },
];

const options = [
  ["PETRI390", "C", "39.00", "0.72", "31.8%", "0.54", "18.4K", "96.2K"],
  ["PETRI400", "C", "40.00", "0.39", "30.9%", "0.38", "25.7K", "142.8K"],
  ["PETRI410", "C", "41.00", "0.18", "30.4%", "0.24", "31.1K", "178.3K"],
  ["PETRU360", "P", "36.00", "0.31", "33.9%", "-0.28", "14.2K", "88.1K"],
  ["PETRU370", "P", "37.00", "0.52", "32.7%", "-0.42", "19.8K", "112.6K"],
  ["PETRU380", "P", "38.00", "0.86", "31.9%", "-0.61", "22.4K", "135.9K"],
];

function Sparkline({ up = true }: { up?: boolean }) {
  const points = up
    ? "0,45 12,42 24,46 36,35 48,39 60,28 72,31 84,20 96,24 108,12 120,17 132,8"
    : "0,10 12,13 24,8 36,20 48,17 60,28 72,24 84,34 96,31 108,42 120,38 132,48";
  return (
    <svg viewBox="0 0 132 52" className="sparkline" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {hint && <div className="metric-hint">{hint}</div>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selected, setSelected] = useState<Stock>(stocks[0]);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("Todos");
  const [favorite, setFavorite] = useState(false);
  const [range, setRange] = useState("1 ano");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stocks.filter((s) =>
      (!q || `${s.ticker} ${s.name}`.toLowerCase().includes(q)) &&
      (sector === "Todos" || s.sector === sector)
    );
  }, [query, sector]);

  const selectStock = (s: Stock) => {
    setSelected(s);
    setTab("details");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Visão geral" },
    { id: "scanner", label: "Scanner" },
    { id: "watchlist", label: "Watchlist" },
    { id: "details", label: "Detalhes" },
    { id: "news", label: "Eventos" },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">B3</div>
          <div>
            <div className="brand-name">B3Options</div>
            <div className="brand-sub">VOLATILIDADE • OPÇÕES • B3</div>
          </div>
        </div>
        <div className="market-status"><span className="dot" /> Mercado aberto</div>
        <div className="top-actions">
          <button className="icon-btn">⌕</button>
          <button className="icon-btn">⚙</button>
          <button className="avatar">R</button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((item) => (
          <button key={item.id} className={tab === item.id ? "tab active" : "tab"} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <main className="main">
        <section className="hero">
          <div>
            <div className="eyebrow">TERMINAL DE VOLATILIDADE</div>
            <h1>Opções B3 em um só lugar.</h1>
            <p>IV, volatilidade histórica, IV Rank, percentis, skew, term structure, gregas, liquidez e fluxo.</p>
          </div>
          <div className="hero-date">
            <span>Dados de referência</span>
            <strong>18 SET 2026 • 15:42 BRT</strong>
          </div>
        </section>

        {tab === "dashboard" && (
          <>
            <section className="market-strip">
              <Metric label="IBOV" value="142.318" hint="+0,82%" />
              <Metric label="IV média" value="26,4%" hint="universo B3" />
              <Metric label="IV Rank médio" value="61" hint="últimos 252 pregões" />
              <Metric label="Opções líquidas" value="R$ 1,42 bi" hint="volume diário" />
              <Metric label="Open Interest" value="32,8 mi" hint="contratos" />
            </section>

            <section className="toolbar">
              <div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar ticker ou empresa..." /></div>
              <select value={sector} onChange={(e) => setSector(e.target.value)}>
                <option>Todos</option><option>Petróleo</option><option>Bancos</option><option>Mineração</option><option>Indústria</option><option>Varejo</option><option>Financeiro</option><option>Consumo</option>
              </select>
              <button className="filter-btn">Filtros avançados</button>
            </section>

            <div className="section-head">
              <div><h2>Scanner de volatilidade</h2><span>{filtered.length} ativos no universo</span></div>
              <div className="sort">Ordenar: <b>IV Rank ↓</b></div>
            </div>

            <section className="cards">
              {filtered.map((s) => (
                <article className="stock-card" key={s.ticker} onClick={() => selectStock(s)}>
                  <div className="card-top">
                    <div><strong>{s.ticker}</strong><span>{s.name}</span></div>
                    <span className={s.change >= 0 ? "change positive" : "change negative"}>{s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%</span>
                  </div>
                  <div className="price-row"><strong>R$ {s.price.toFixed(2)}</strong><Sparkline up={s.change >= 0} /></div>
                  <div className="metric-grid">
                    <Metric label="IV" value={`${s.iv.toFixed(1)}%`} hint={`HV ${s.hv.toFixed(1)}%`} />
                    <Metric label="IV Rank" value={`${s.ivRank}`} hint="252D" />
                    <Metric label="Percentil" value={`${s.ivPercentile}%`} hint="252D" />
                    <Metric label="Skew" value={`${s.skew.toFixed(1)}`} hint="25Δ" />
                  </div>
                  <div className="card-footer">
                    <span>OI {s.oi}</span><span>Vol {s.volume}</span><span>{s.options} séries</span>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {tab === "scanner" && (
          <section className="panel scanner-panel">
            <div className="panel-head"><div><h2>Scanner avançado</h2><p>Encontre combinações de volatilidade e liquidez.</p></div><button className="primary">Salvar filtro</button></div>
            <div className="scanner-grid">
              {[
                ["IV Rank mínimo", "70"], ["IV Percentile mínimo", "80"], ["IV - HV mínimo", "3%"], ["DTE mínimo", "20"], ["DTE máximo", "90"], ["OI mínimo", "100K"],
              ].map(([a,b]) => <label key={a}>{a}<input defaultValue={b} /></label>)}
            </div>
            <div className="table-wrap"><table><thead><tr><th>Ticker</th><th>IV</th><th>HV</th><th>IV-HV</th><th>IV Rank</th><th>Percentil</th><th>Skew</th><th>OI</th></tr></thead><tbody>{stocks.filter(s => s.ivRank >= 70).map(s => <tr key={s.ticker} onClick={() => selectStock(s)}><td><b>{s.ticker}</b></td><td>{s.iv.toFixed(1)}%</td><td>{s.hv.toFixed(1)}%</td><td className="positive">+{(s.iv-s.hv).toFixed(1)}%</td><td><b>{s.ivRank}</b></td><td>{s.ivPercentile}%</td><td>{s.skew.toFixed(1)}</td><td>{s.oi}</td></tr>)}</tbody></table></div>
          </section>
        )}

        {tab === "watchlist" && (
          <section className="panel"><div className="panel-head"><div><h2>Minha watchlist</h2><p>Acompanhe ativos e métricas que você definiu.</p></div><button className="primary">+ Adicionar ativo</button></div>
            <div className="watchlist">{stocks.slice(0,5).map(s => <div className="watch-row" key={s.ticker} onClick={() => selectStock(s)}><div><b>{s.ticker}</b><span>{s.name}</span></div><span>{s.iv.toFixed(1)}% IV</span><span>IV Rank <b>{s.ivRank}</b></span><span className={s.change >= 0 ? "positive" : "negative"}>{s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%</span></div>)}</div>
          </section>
        )}

        {tab === "news" && (
          <section className="panel"><div className="panel-head"><div><h2>Eventos e catalisadores</h2><p>Área preparada para integrar calendário corporativo e notícias.</p></div></div>
            <div className="events">{["Vencimento de opções — próximo ciclo", "Divulgação de resultados — calendário", "Data-com / proventos", "Eventos corporativos e fatos relevantes"].map((x,i)=><div className="event" key={x}><span className="event-date">SET {18+i*4}</span><div><b>{x}</b><p>Fonte de dados real poderá ser conectada nesta seção.</p></div></div>)}</div>
          </section>
        )}

        {tab === "details" && (
          <section className="details">
            <div className="detail-header">
              <button className="back" onClick={() => setTab("dashboard")}>← Scanner</button>
              <div className="asset-title"><div className="ticker-big">{selected.ticker}</div><div><h2>{selected.name}</h2><span>{selected.sector} • ações e opções</span></div></div>
              <button className={favorite ? "star active" : "star"} onClick={() => setFavorite(!favorite)}>{favorite ? "★" : "☆"} Watchlist</button>
            </div>
            <div className="detail-stats"><Metric label="Preço" value={`R$ ${selected.price.toFixed(2)}`} hint={`${selected.change >= 0 ? "+" : ""}${selected.change.toFixed(2)}% hoje`} /><Metric label="IV ATM" value={`${selected.iv.toFixed(1)}%`} hint="30D interpolada" /><Metric label="HV" value={`${selected.hv.toFixed(1)}%`} hint="30D close-to-close" /><Metric label="IV Rank" value={`${selected.ivRank}`} hint="252 pregões" /><Metric label="IV Percentile" value={`${selected.ivPercentile}%`} hint="252 pregões" /><Metric label="IV − HV" value={`${(selected.iv-selected.hv).toFixed(1)}%`} hint="prêmio de vol" /></div>

            <div className="chart-panel panel">
              <div className="panel-head"><div><h3>Histórico de IV × HV</h3><p>Volatilidade anualizada • janela {range}</p></div><div className="ranges">{["3 meses","6 meses","1 ano","2 anos"].map(r=><button className={range===r?"selected":""} key={r} onClick={()=>setRange(r)}>{r}</button>)}</div></div>
              <div className="big-chart">
                <div className="y-labels"><span>50%</span><span>40%</span><span>30%</span><span>20%</span><span>10%</span></div>
                <svg viewBox="0 0 900 300" preserveAspectRatio="none"><g className="gridlines"><line x1="0" y1="20" x2="900" y2="20"/><line x1="0" y1="80" x2="900" y2="80"/><line x1="0" y1="140" x2="900" y2="140"/><line x1="0" y1="200" x2="900" y2="200"/><line x1="0" y1="260" x2="900" y2="260"/></g><polyline className="line-iv" points="0,190 70,170 140,185 210,125 280,150 350,105 420,130 490,85 560,120 630,65 700,100 770,75 840,45 900,60"/><polyline className="line-hv" points="0,210 70,200 140,195 210,170 280,180 350,160 420,165 490,145 560,155 630,135 700,145 770,125 840,120 900,115"/></svg>
                <div className="chart-legend"><span><i className="legend-iv"/> IV</span><span><i className="legend-hv"/> HV</span></div>
              </div>
            </div>

            <div className="two-col">
              <div className="panel"><div className="panel-head"><div><h3>Term structure</h3><p>IV por vencimento</p></div></div><div className="term-chart">{expiries.map((e,i)=><div className="term-item" key={e.label}><span>{e.label}</span><div className="bar"><i style={{width:`${e.iv/40*100}%`}}/></div><b>{e.iv.toFixed(1)}%</b></div>)}</div></div>
              <div className="panel"><div className="panel-head"><div><h3>Distribuição de IV</h3><p>252 pregões</p></div></div><div className="distribution">{[8,15,24,36,54,72,90,70,48,31,19,10].map((h,i)=><i key={i} style={{height:`${h}%`}}/> )}</div><div className="dist-caption"><span>Mín 16,2%</span><b>Atual {selected.iv.toFixed(1)}%</b><span>Máx 49,7%</span></div></div>
            </div>

            <div className="panel options-panel"><div className="panel-head"><div><h3>Cadeia de opções</h3><p>Próximo vencimento • dados demonstrativos</p></div><div className="chain-controls"><button className="selected">Calls</button><button>Puts</button><select><option>17 OUT 2026</option><option>21 NOV 2026</option></select></div></div><div className="table-wrap"><table><thead><tr><th>Opção</th><th>Tipo</th><th>Strike</th><th>Prêmio</th><th>IV</th><th>Delta</th><th>Volume</th><th>OI</th></tr></thead><tbody>{options.map(o=><tr key={o[0]}><td><b>{o[0]}</b></td>{o.slice(1).map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div></div>

            <div className="greeks-grid">{[["Delta","0,54","sensibilidade ao ativo"],["Gamma","0,032","convexidade"],["Theta","-0,018","decaimento diário"],["Vega","0,094","sensibilidade à IV"],["Rho","0,021","sensibilidade a juros"],["Skew 25Δ","-5,4","inclinação da superfície"]].map(([a,b,c])=><div className="panel greek" key={a}><span>{a}</span><b>{b}</b><small>{c}</small></div>)}</div>
          </section>
        )}
      </main>

      <footer><span>B3Options • terminal de análise</span><span>Dados demonstrativos • Conecte uma fonte licenciada para cotações reais.</span></footer>
    </div>
  );
}