# B3Vol

Terminal web de análise de volatilidade e opções para ações negociadas na B3.

## O que já está no MVP

- Dashboard/scanner com cards de ações
- IV, HV, IV/HV, IV Rank e IV Percentile
- Sparklines de volatilidade
- Busca e filtros
- Ordenação por métricas
- Ranking lateral
- Detalhamento do ativo
- Série IV x HV
- Histórico de IV Rank
- Distribuição de IV
- Curva de IV por strike
- Term structure
- Skew 25-delta
- Cadeia de opções com gregas, volume, OI e spread
- Fluxo/negócios em uma visão resumida
- Watchlist local
- Interface responsiva
- Dados mockados, prontos para serem substituídos por uma API real

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite.

## Próxima etapa: dados reais

O frontend está propositalmente desacoplado da fonte de dados. A ideia é criar uma API backend que entregue:

- ativos e cotações
- candles históricos
- cadeia de opções
- bid/ask/last
- volume
- open interest
- IV
- gregas
- eventos/dividendos
- séries históricas de IV/HV

Depois, substitua `src/data/mockData.ts` pelos hooks de API em `src/api/`.

## Observação

Os números exibidos neste MVP são fictícios e servem somente para prototipação da interface e dos cálculos/visualizações. Não use os dados mockados para tomada de decisão financeira.
