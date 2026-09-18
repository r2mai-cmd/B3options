export type Asset = {
  ticker: string
  name: string
  price: number
  change: number
  iv: number
  hv30: number
  ivhv: number
  ivRank: number
  percentile: number
  volume: number
  oi: number
  sector: string
  spark: number[]
}

export type OptionRow = {
  symbol: string
  type: 'Call' | 'Put'
  strike: number
  expiry: string
  dte: number
  bid: number
  ask: number
  last: number
  volume: number
  oi: number
  iv: number
  delta: number
  gamma: number
  theta: number
  vega: number
}

export type HistoryPoint = {
  date: string
  iv: number
  hv: number
  rank: number
  percentile: number
}
