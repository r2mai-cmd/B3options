import { useMemo, useState } from "react";
import "./App.css";

type Tab = "dashboard" | "scanner" | "watchlist" | "details" | "news";
type OptionType = "CALL" | "PUT";

type Asset = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  iv: number;
  hv: number;
  ivRank: number;
  ivPercentile: number;
  skew: number;
  liquidity: number;
  openInterest: number;
  volume: number;
  beta: number;
  dividendYield: number;
  earningsDays: number;
};

type OptionRow = {
  symbol: string;
  type: OptionType;
  strike: number;
  expiration: string;
  days: number;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  oi: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
};

const assets: Asset[] = [
  { ticker: "PETR4", name: "Petrobras PN", sector: "Petróleo & Gás", price: 38.42, change: 1.84, iv: 31.6, hv: 27.8, ivRank: 72, ivPercentile: 81, skew: -4.8, liquidity: 96, openInterest: 1840000, volume: 428000, beta: 1.18, dividendYield: 10.8, earningsDays: 21 },
  { ticker: "VALE3", name: "Vale ON", sector: "Mineração", price: 61.18, change: -0.72, iv: 28.4, hv: 29.7, ivRank: 46, ivPercentile: 53, skew: -6.2, liquidity: 93, openInterest: 1260000, volume: 311000, beta: 1.05, dividendYield: 7.1, earningsDays: 35 },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", sector: "Bancos", price: 39.75, change: 0.48, iv: 22.9, hv: 20.4, ivRank: 63, ivPercentile: 70, skew: -3.1, liquidity: 98, openInterest: 980000, volume: 287000, beta: 0.91, dividendYield: 6.4, earningsDays: 28 },
  { ticker: "BBDC4", name: "Bradesco PN", sector: "Bancos", price: 14.62, change: -1.12, iv: 26.7, hv: 24.1, ivRank: 58, ivPercentile: 64, skew: -4.2, liquidity: 91, openInterest: 720000, volume: 192000, beta: 1.02, dividendYield: 5.9, earningsDays: 42 },
  { ticker: "BBAS3", name: "Banco do Brasil ON", sector: "Bancos", price: 28.93, change: 0.91, iv: 25.1, hv: 22.7, ivRank: 67, ivPercentile: 75, skew: -5.5, liquidity: 89, openInterest: 615000, volume: 141000, beta: 1.08, dividendYield: 8.2, earningsDays: 31 },
  { ticker: "WEGE3", name: "WEG ON", sector: "Bens Industriais", price: 48.31, change: 1.27, iv: 24.3, hv: 25.6, ivRank: 38, ivPercentile: 44, skew: -2.7, liquidity: 86, openInterest: 284000, volume: 69000, beta: 0.86, dividendYield: 1.8, earningsDays: 49 },
  { ticker: "ABEV3", name: "Ambev ON", sector: "Bebidas", price: 13.94, change: 0.15, iv: 20.8, hv: 18.9, ivRank: 51, ivPercentile: 58, skew: -2.2, liquidity: 88, openInterest: 410000, volume: 103000, beta: 0.72, dividendYield: 5.2, earningsDays: 17 },
  { ticker: "B3SA3", name: "B3 ON", sector: "Financeiro", price: 13.18, change: -0.38, iv: 23.7, hv: 21.2, ivRank: 55, ivPercentile: 61, skew: -3.9, liquidity: 90, openInterest: 530000, volume: 118000, beta: 1.01, dividendYield: 2.7, earningsDays: 24 },
];

const expirations = ["18/09/2026", "16/10/2026", "20/11/2026", "18/12/2026"];

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} mi`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} mil`;
  return value.toString();
}

function Sparkline({ positive = true }: { positive?: boolean }) {
  const points = positive
    ? "0,48 15,44 30,46 45,37 60,39 75,30 90,34 105,22 120,26 135,16 150,20 165,8"
    : "0,12 15,17 30,15 45,25 60,22 75,31 90,29 105,39 120,34 135,45 150,41 165,53";
  return (
    <svg className="sparkline" viewBox="0 0 165 60" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Metric({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "positive" | "negative" | "accent";
}) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <strong className={`metric-value ${tone}`}>{value}</strong>
      {hint && <span className="metric-hint">{hint}</span>}
    </div>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("Todos");
  const [sort, setSort] = useState<"ivRank" | "iv" | "percentile" | "change">("ivRank");
  const [selectedTicker, setSelectedTicker] = useState("PETR4");
  const [favorite, setFavorite] = useState<string[]>(["PETR4", "ITUB4"]);
  const [expiration, setExpiration] = useState(expirations[0]);
  const [optionType, setOptionType] = useState<"ALL" | OptionType>("ALL");

  const selected = assets.find((a) => a.ticker === selectedTicker) ?? assets[0];

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...assets]
      .filter((a) => sector === "Todos" || a.sector === sector)
      .filter((a) => !normalized || `${a.ticker} ${a.name}`.toLowerCase().includes(normalized))
      .sort((a, b) => {
        if (sort === "iv") return b.iv - a.iv;
        if (sort === "percentile") return b.ivPercentile - a.ivPercentile;
        if (sort === "change") return b.change - a.change;
        return b.ivRank - a.ivRank;
      });
  }, [query, sector, sort]);

  const sectors = ["Todos", ...Array.from(new Set(assets.map((a) => a.sector)))];

  const options = useMemo<OptionRow[]>(() => {
    const base = selected.price;
    const rows: OptionRow[] = [];
    const strikes = [
      base * 0.9,
      base * 0.95,
      base * 0.98,
      base,
      base * 1.02,
      base * 1.05,
      base * 1.1,
    ];
    strikes.forEach((strike, i) => {
      const distance = (strike - base) / base;
      const callIv = selected.iv + distance * 7 + i * 0.15;
      const putIv = selected.iv - distance * 5 + (6 - i) * 0.18;
      const callLast = Math.max(0.12, base * Math.max(0.01, 0.07 - distance * 0.9));
      const putLast = Math.max(0.12, base * Math.max(0.01, 0.07 + distance * 0.9));
      rows.push({
        symbol: `${selected.ticker}${i + 1}C`,
        type: "CALL",
        strike,
        expiration,
        days: 28,
        bid: callLast * 0.98,
        ask: callLast * 1.02,
        last: callLast,
        volume: Math.round(18000 - i * 1300),
        oi: Math.round(125000 - i * 8500),
        iv: callIv,
        delta: Math.max(0.04, Math.min(0.96, 0.55 - distance * 2.1)),
        gamma: 0.018 - Math.abs(distance) * 0.006,
        theta: -(callLast * 0.045),
        vega: base * 0.0018,
      });
      rows.push({
        symbol: `${selected.ticker}${i + 1}P`,
        type: "PUT",
        strike,
        expiration,
        days: 28,
        bid: putLast * 0.98,
        ask: putLast * 1.02,
        last: putLast,
        volume: Math.round(15000 - i * 1000),
        oi: Math.round(110000 - i * 7200),
        iv: putIv,
        delta: -Math.max(0.04, Math.min(0.96, 0.45 + distance * 2.0)),
        gamma: 0.017 - Math.abs(distance) * 0.005,
        theta: -(putLast * 0.047),
        vega: base * 0.0019,
      });
    });
    return rows.filter((r) => optionType === "ALL" || r.type === optionType);
  }, [selected, expiration, optionType]);

  function toggleFavorite(ticker: string) {
    setFavorite((current) =>
      current.includes(ticker) ? current.filter((x) => x !== ticker) : [...current, ticker],
    );
  }

  function openDetails(ticker: string) {
    setSelectedTicker(ticker);
    setTab("details");
  }

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

        <div className="market-status">
          <span className="status-dot" />
          Mercado aberto
        </div>

        <div className="top-actions">
          <button className="icon-btn" title="Pesquisa">⌕</button>
          <button className="icon-btn" title="Notificações">◔</button>
          <button className="avatar">R</button>
        </div>
      </header>

      <nav className="tabs">
        {([
          ["dashboard", "Visão geral"],
          ["scanner", "Scanner"],
          ["watchlist", "Watchlist"],
          ["details", "Detalhes"],
          ["news", "Eventos"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "tab active" : "tab"}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="main">
        <section className="hero">
          <div>
            <div className="eyebrow">TERMINAL DE VOLATILIDADE</div>
            <h1>Opções B3 em um só lugar.</h1>
            <p>IV, volatilidade histórica, IV Rank, percentil, skew, term structure, gregas, liquidez e fluxo.</p>
          </div>
          <div className="hero-date">
            <span>Dados de referência</span>
            <strong>18 SET 2026 • 15:42 BRT</strong>
          </div>
        </section>

        {tab === "dashboard" && (
          <>
            <section className="metric-grid">
              <Metric label="IBOV" value="142.318" hint="+0,82%" tone="positive" />
              <Metric label="IV média B3" value="26,4%" hint="universo B3" tone="accent" />
              <Metric label="IV Rank médio" value="61" hint="últimos 252 pregões" />
              <Metric label="Opções líquidas" value="1.842" hint="volume relevante" />
              <Metric label="Open Interest" value="32,8 mi" hint="contratos" />
            </section>

            <section className="toolbar">
              <div className="search">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar ação ou ticker..."
                />
              </div>
              <select value={sector} onChange={(e) => setSector(e.target.value)}>
                {sectors.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="ivRank">Ordenar: IV Rank</option>
                <option value="iv">Ordenar: IV</option>
                <option value="percentile">Ordenar: Percentil</option>
                <option value="change">Ordenar: Variação</option>
              </select>
              <span className="result-count">{filteredAssets.length} ativos</span>
            </section>

            <section className="cards-grid">
              {filteredAssets.map((asset) => (
                <article className="asset-card" key={asset.ticker} onClick={() => openDetails(asset.ticker)}>
                  <div className="asset-head">
                    <div>
                      <div className="ticker-row">
                        <strong>{asset.ticker}</strong>
                        <button
                          className={`star ${favorite.includes(asset.ticker) ? "selected" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.ticker); }}
                          title="Adicionar à watchlist"
                        >
                          {favorite.includes(asset.ticker) ? "★" : "☆"}
                        </button>
                      </div>
                      <span>{asset.name}</span>
                    </div>
                    <div className={asset.change >= 0 ? "change positive" : "change negative"}>
                      {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                    </div>
                  </div>

                  <div className="price-line">
                    <strong>{money(asset.price)}</strong>
                    <span>{asset.sector}</span>
                  </div>

                  <div className="mini-metrics">
                    <div><span>IV</span><strong>{asset.iv.toFixed(1)}%</strong></div>
                    <div><span>HV 30D</span><strong>{asset.hv.toFixed(1)}%</strong></div>
                    <div><span>IV Rank</span><strong>{asset.ivRank}</strong></div>
                    <div><span>Percentil</span><strong>{asset.ivPercentile}</strong></div>
                  </div>

                  <div className="rank-bar">
                    <span style={{ width: `${asset.ivRank}%` }} />
                  </div>

                  <div className="card-bottom">
                    <div>
                      <span>IV × HV</span>
                      <strong>{(asset.iv - asset.hv >= 0 ? "+" : "") + (asset.iv - asset.hv).toFixed(1)} pp</strong>
                    </div>
                    <Sparkline positive={asset.change >= 0} />
                  </div>

                  <div className="card-foot">
                    <span>OI {compact(asset.openInterest)}</span>
                    <span>Vol {compact(asset.volume)}</span>
                    <span>Skew {asset.skew.toFixed(1)}</span>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {tab === "scanner" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <div className="eyebrow">SCANNER</div>
                <h2>Onde a volatilidade está chamando atenção</h2>
              </div>
              <div className="chips">
                <span className="chip">IV Rank &gt; 60</span>
                <span className="chip">Liquidez alta</span>
              </div>
            </div>
            <div className="scanner-table">
              {filteredAssets.map((a, index) => (
                <div className="scanner-row" key={a.ticker} onClick={() => openDetails(a.ticker)}>
                  <span className="position">{index + 1}</span>
                  <strong>{a.ticker}</strong>
                  <span>{a.name}</span>
                  <span>IV <b>{a.iv.toFixed(1)}%</b></span>
                  <span>HV <b>{a.hv.toFixed(1)}%</b></span>
                  <span>Rank <b>{a.ivRank}</b></span>
                  <span>Percentil <b>{a.ivPercentile}</b></span>
                  <span className={a.change >= 0 ? "positive" : "negative"}>{a.change >= 0 ? "+" : ""}{a.change.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "watchlist" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <div className="eyebrow">WATCHLIST</div>
                <h2>Ativos acompanhados</h2>
              </div>
              <span className="result-count">{favorite.length} ativos</span>
            </div>
            <div className="watch-grid">
              {assets.filter((a) => favorite.includes(a.ticker)).map((a) => (
                <div className="watch-item" key={a.ticker} onClick={() => openDetails(a.ticker)}>
                  <div>
                    <strong>{a.ticker}</strong>
                    <span>{a.name}</span>
                  </div>
                  <div><b>{a.iv.toFixed(1)}%</b><small>IV</small></div>
                  <div><b>{a.ivRank}</b><small>Rank</small></div>
                  <div className={a.change >= 0 ? "positive" : "negative"}>{a.change >= 0 ? "+" : ""}{a.change.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "details" && (
          <>
            <section className="detail-header panel">
              <div className="detail-title">
                <button className="back-btn" onClick={() => setTab("dashboard")}>← Voltar</button>
                <div className="ticker-large">{selected.ticker}</div>
                <div>
                  <h2>{selected.name}</h2>
                  <span>{selected.sector} • {money(selected.price)} • <b className={selected.change >= 0 ? "positive" : "negative"}>{selected.change >= 0 ? "+" : ""}{selected.change.toFixed(2)}%</b></span>
                </div>
              </div>
              <button className="primary-btn" onClick={() => toggleFavorite(selected.ticker)}>
                {favorite.includes(selected.ticker) ? "★ Na watchlist" : "☆ Adicionar"}
              </button>
            </section>

            <section className="detail-grid">
              <Metric label="Volatilidade implícita" value={`${selected.iv.toFixed(1)}%`} hint="média ponderada" tone="accent" />
              <Metric label="Volatilidade histórica" value={`${selected.hv.toFixed(1)}%`} hint="30 dias" />
              <Metric label="IV Rank" value={`${selected.ivRank}`} hint="252 pregões" />
              <Metric label="IV Percentile" value={`${selected.ivPercentile}`} hint="% de dias abaixo" />
              <Metric label="Skew 25Δ" value={`${selected.skew.toFixed(1)}%`} hint="put − call" />
              <Metric label="Liquidez" value={`${selected.liquidity}/100`} hint="score indicativo" />
            </section>

            <section className="charts-grid">
              <div className="panel chart-panel">
                <div className="panel-head">
                  <div><span className="eyebrow">HISTÓRICO</span><h3>IV × HV — 252 pregões</h3></div>
                  <span className="legend"><i className="legend-iv" /> IV <i className="legend-hv" /> HV</span>
                </div>
                <div className="big-chart">
                  <div className="grid-lines" />
                  <svg viewBox="0 0 700 240" preserveAspectRatio="none">
                    <polyline points="0,160 45,145 90,155 135,130 180,140 225,118 270,126 315,98 360,112 405,88 450,101 495,72 540,84 585,64 630,77 700,48" fill="none" stroke="currentColor" strokeWidth="3" />
                    <polyline points="0,178 45,166 90,171 135,155 180,160 225,149 270,151 315,132 360,141 405,125 450,132 495,115 540,121 585,106 630,111 700,99" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 6" opacity=".55" />
                  </svg>
                  <div className="chart-axis"><span>-252D</span><span>-180D</span><span>-90D</span><span>Hoje</span></div>
                </div>
              </div>

              <div className="panel chart-panel">
                <div className="panel-head">
                  <div><span className="eyebrow">IV RANK</span><h3>Distribuição histórica</h3></div>
                  <strong className="big-number">{selected.ivRank}</strong>
                </div>
                <div className="histogram">
                  {Array.from({ length: 28 }, (_, i) => (
                    <span key={i} style={{ height: `${18 + ((i * 17) % 70)}%` }} />
                  ))}
                  <div className="hist-marker" style={{ left: `${selected.ivRank}%` }} />
                </div>
                <div className="chart-axis"><span>IV baixa</span><span>mediana</span><span>IV alta</span></div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div><span className="eyebrow">VOLATILIDADE</span><h3>Smile, skew e term structure</h3></div>
                <div className="control-group">
                  <select value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                    {expirations.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="vol-grid">
                <div className="subchart">
                  <h4>IV por strike</h4>
                  <svg viewBox="0 0 500 200" preserveAspectRatio="none">
                    <polyline points="10,65 80,83 150,101 220,110 290,106 360,87 430,59 490,38" fill="none" stroke="currentColor" strokeWidth="3" />
                    {[10,80,150,220,290,360,430,490].map((x, i) => <circle key={x} cx={x} cy={[65,83,101,110,106,87,59,38][i]} r="4" fill="currentColor" />)}
                  </svg>
                  <div className="chart-axis"><span>−20%</span><span>ATM</span><span>+20%</span></div>
                </div>
                <div className="subchart">
                  <h4>Term structure</h4>
                  <div className="term-bars">
                    {[31.6, 30.4, 28.9, 27.8, 26.4].map((v, i) => (
                      <div className="term-item" key={v}>
                        <span>{[28, 56, 91, 154, 245][i]}D</span>
                        <div><i style={{ width: `${v * 2.2}%` }} /></div>
                        <b>{v.toFixed(1)}%</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="panel option-chain">
              <div className="panel-head">
                <div><span className="eyebrow">CHAIN</span><h3>Cadeia de opções</h3></div>
                <div className="chain-controls">
                  <select value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                    {expirations.map((e) => <option key={e}>{e}</option>)}
                  </select>
                  <select value={optionType} onChange={(e) => setOptionType(e.target.value as typeof optionType)}>
                    <option value="ALL">Calls + Puts</option>
                    <option value="CALL">Calls</option>
                    <option value="PUT">Puts</option>
                  </select>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Opção</th><th>Tipo</th><th>Strike</th><th>Bid</th><th>Ask</th><th>Último</th>
                      <th>Vol</th><th>OI</th><th>IV</th><th>Delta</th><th>Gamma</th><th>Theta</th><th>Vega</th>
                    </tr>
                  </thead>
                  <tbody>
                    {options.map((o) => (
                      <tr key={o.symbol}>
                        <td><strong>{o.symbol}</strong></td>
                        <td><span className={o.type === "CALL" ? "type-call" : "type-put"}>{o.type}</span></td>
                        <td>{money(o.strike)}</td>
                        <td>{money(o.bid)}</td>
                        <td>{money(o.ask)}</td>
                        <td>{money(o.last)}</td>
                        <td>{compact(o.volume)}</td>
                        <td>{compact(o.oi)}</td>
                        <td><b>{o.iv.toFixed(1)}%</b></td>
                        <td>{o.delta.toFixed(2)}</td>
                        <td>{o.gamma.toFixed(3)}</td>
                        <td>{o.theta.toFixed(3)}</td>
                        <td>{o.vega.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-note">Dados exibidos são demonstrativos. Conecte uma fonte de mercado para cotações e gregas em tempo real.</div>
            </section>

            <section className="risk-grid">
              <div className="panel">
                <span className="eyebrow">CONTEXTO</span>
                <h3>Informações do ativo</h3>
                <div className="info-list">
                  <div><span>Beta</span><b>{selected.beta.toFixed(2)}</b></div>
                  <div><span>Dividend yield</span><b>{selected.dividendYield.toFixed(1)}%</b></div>
                  <div><span>Próximo resultado</span><b>em {selected.earningsDays} dias</b></div>
                  <div><span>Open Interest</span><b>{compact(selected.openInterest)}</b></div>
                  <div><span>Volume opções</span><b>{compact(selected.volume)}</b></div>
                </div>
              </div>
              <div className="panel">
                <span className="eyebrow">LEITURA</span>
                <h3>Indicadores quantitativos</h3>
                <div className="signal-list">
                  <div><span>IV − HV</span><strong>{(selected.iv - selected.hv).toFixed(1)} pp</strong></div>
                  <div><span>IV Rank</span><strong>{selected.ivRank}/100</strong></div>
                  <div><span>Percentil</span><strong>{selected.ivPercentile}/100</strong></div>
                  <div><span>Skew 25Δ</span><strong>{selected.skew.toFixed(1)}%</strong></div>
                </div>
              </div>
            </section>
          </>
        )}

        {tab === "news" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <div className="eyebrow">EVENTOS</div>
                <h2>Eventos que podem afetar a volatilidade</h2>
              </div>
              <span className="chip">Próximos 60 dias</span>
            </div>
            <div className="events">
              {[
                ["18/09", "Vencimento de opções", "Janela de vencimento mensal da B3", "Mercado"],
                ["21/09", "Reunião do Copom", "Decisão e comunicação de política monetária", "Macro"],
                ["09/10", "Dados de inflação", "Indicadores econômicos podem alterar expectativas", "Macro"],
                ["16/10", "Vencimento de opções", "Próximo ciclo de vencimento", "Mercado"],
                ["31/10", "Temporada de resultados", "Janela de divulgação de resultados corporativos", "Empresas"],
              ].map(([date, title, description, tag]) => (
                <div className="event" key={title + date}>
                  <div className="event-date">{date}</div>
                  <div><strong>{title}</strong><span>{description}</span></div>
                  <span className="chip">{tag}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span>B3Options • Terminal de volatilidade</span>
        <span>Dados demonstrativos • Não é recomendação de investimento</span>
      </footer>
    </div>
  );
}

export default App;
