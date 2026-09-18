import type { Asset, HistoryPoint, OptionRow } from '../types'

const s = (base: number, drift = 0, noise = 1, n = 44) =>
  Array.from({ length: n }, (_, i) =>
    Math.max(2, base + drift * i + Math.sin(i * 0.73) * noise + Math.sin(i * 0.19) * noise * 0.6)
  )

export const assets: Asset[] = [
  { ticker:'PETR4', name:'Petrobras', price:38.42, change:1.24, iv:32.4, hv30:24.1, ivhv:1.34, ivRank:82.4, percentile:91, volume:412.3, oi:8.4, sector:'Petróleo', spark:s(26,.16,2.4) },
  { ticker:'VALE3', name:'Vale', price:67.18, change:-0.32, iv:28.7, hv30:26.8, ivhv:1.07, ivRank:47.2, percentile:54, volume:266.7, oi:7.1, sector:'Mineração', spark:s(24,.08,1.5) },
  { ticker:'ITUB4', name:'Itaú Unibanco', price:32.11, change:0.86, iv:24.1, hv30:20.3, ivhv:1.19, ivRank:68.1, percentile:73, volume:198.5, oi:6.4, sector:'Bancos', spark:s(21,.06,1.4) },
  { ticker:'BBDC4', name:'Bradesco', price:14.82, change:1.02, iv:31.5, hv30:23.4, ivhv:1.35, ivRank:79.3, percentile:88, volume:146.2, oi:5.9, sector:'Bancos', spark:s(24,.17,2.2) },
  { ticker:'ABEV3', name:'Ambev', price:12.47, change:-0.48, iv:26.8, hv30:18.9, ivhv:1.42, ivRank:74.1, percentile:81, volume:92.1, oi:3.6, sector:'Bebidas', spark:s(19,.14,1.7) },
  { ticker:'WEGE3', name:'WEG', price:51.23, change:0.77, iv:25.1, hv30:21.7, ivhv:1.16, ivRank:62.4, percentile:69, volume:78.3, oi:2.8, sector:'Bens de capital', spark:s(21,.09,1.6) },
  { ticker:'B3SA3', name:'B3', price:12.15, change:-1.06, iv:29.4, hv30:25.2, ivhv:1.17, ivRank:58.7, percentile:66, volume:121.4, oi:4.1, sector:'Financeiro', spark:s(29,-.03,1.5) },
  { ticker:'ELET3', name:'Eletrobras', price:41.86, change:1.35, iv:33.2, hv30:24.8, ivhv:1.34, ivRank:76.9, percentile:84, volume:110.2, oi:3.1, sector:'Energia', spark:s(27,.12,2.2) },
  { ticker:'RENT3', name:'Localiza', price:43.09, change:0.42, iv:27.2, hv30:22.7, ivhv:1.20, ivRank:55.1, percentile:63, volume:64.4, oi:1.9, sector:'Consumo', spark:s(23,.07,1.2) },
  { ticker:'SUZB3', name:'Suzano', price:58.77, change:-0.15, iv:30.8, hv30:27.4, ivhv:1.12, ivRank:44.7, percentile:51, volume:81.7, oi:2.4, sector:'Papel e celulose', spark:s(28,.04,1.7) },
  { ticker:'PRIO3', name:'PRIO', price:49.66, change:2.14, iv:41.7, hv30:30.2, ivhv:1.38, ivRank:88.9, percentile:94, volume:73.2, oi:2.1, sector:'Petróleo', spark:s(32,.22,3.0) },
  { ticker:'GGBR4', name:'Gerdau', price:18.34, change:0.31, iv:27.9, hv30:24.6, ivhv:1.13, ivRank:51.3, percentile:57, volume:55.8, oi:1.8, sector:'Siderurgia', spark:s(25,.05,1.3) },
]

const optionRows = (ticker: string): OptionRow[] => {
  const strikes = [34,35,36,37,38,39,40,41,42]
  return strikes.flatMap((strike, i) => ([
    { symbol:`${ticker}C${strike}`, type:'Call', strike, expiry:'16/10/2026', dte:28, bid:Math.max(.08, 5.2-i*.62), ask:Math.max(.12, 5.45-i*.62), last:Math.max(.1, 5.32-i*.62), volume:1200-i*93, oi:8400-i*320, iv:37-i*.8, delta:.72-i*.075, gamma:.041-i*.002, theta:-.082+i*.004, vega:.114-i*.003 },
    { symbol:`${ticker}P${strike}`, type:'Put', strike, expiry:'16/10/2026', dte:28, bid:Math.max(.08, .72+i*.42), ask:Math.max(.12, .91+i*.42), last:Math.max(.1, .81+i*.42), volume:820-i*41, oi:5200+i*240, iv:39-i*.35, delta:-.28-i*.075, gamma:.039-i*.0018, theta:-.076+i*.003, vega:.108-i*.002 },
  ]))
}

export const optionChain = optionRows('PETR4')

export function historyFor(asset: Asset): HistoryPoint[] {
  return Array.from({ length: 252 }, (_, i) => {
    const wave = Math.sin(i/9)*2.5 + Math.sin(i/27)*3
    const iv = Math.max(10, asset.iv - 7 + (i/251)*7 + wave + Math.sin(i*.71)*1.2)
    const hv = Math.max(8, asset.hv30 - 5 + (i/251)*5 + Math.sin(i/14)*2 + Math.sin(i/33)*2)
    const rank = Math.max(4, Math.min(98, asset.ivRank - 10 + (i/251)*10 + Math.sin(i/17)*12 + Math.sin(i/5)*3))
    const percentile = Math.max(3, Math.min(99, rank + Math.sin(i/13)*7))
    return { date:`${String((i%28)+1).padStart(2,'0')}/${String(((i/28)%12|0)+1).padStart(2,'0')}`, iv, hv, rank, percentile }
  })
}

export const strikeCurve = Array.from({length: 17}, (_, i) => {
  const strike = 30 + i
  const dist = Math.abs(strike - 38.4)
  return { strike, call: 18 + dist*1.45 + Math.max(0, strike-38)*.5, put: 20 + dist*1.7 + Math.max(0, 38-strike)*.3 }
})

export const termStructure = [
  { dte:14, iv:28.6 }, { dte:28, iv:32.4 }, { dte:45, iv:34.1 },
  { dte:60, iv:35.2 }, { dte:90, iv:36.8 }, { dte:180, iv:39.1 }, { dte:252, iv:40.2 }
]

export const skew = Array.from({length: 10}, (_, i) => ({
  date:`${i+1}/09`, call:25+i*.55+Math.sin(i)*1.1, put:42-i*.75+Math.sin(i*.7)*1.2
}))
