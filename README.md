# B3Vol

Terminal web de análise de volatilidade e opções para ações negociadas na B3.

## Rodando localmente

```bash
npm install
npm run dev
```

## Publicando no GitHub Pages

1. Suba os arquivos para a branch `main`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. Faça um novo push na `main` ou execute o workflow em **Actions → Deploy to GitHub Pages → Run workflow**.
5. O site será publicado em:

`https://r2mai-cmd.github.io/B3options/`

O `vite.config.ts` já está configurado com `base: '/B3options/'`.

## Conteúdo do MVP

- Dashboard/scanner com cards
- IV, HV, IV/HV, IV Rank e IV Percentile
- Sparklines
- Busca, filtros e ordenação
- Watchlist
- Rankings
- Página detalhada do ativo
- Histórico IV × HV
- IV Rank histórico
- Distribuição de IV
- Curva por strike
- Term structure
- Skew
- Cadeia de opções
- Gregas
- Volume e Open Interest
- Visão de fluxo
- Área de notícias/eventos preparada para integração

## Dados

Os valores atuais são demonstrativos/mockados. Antes de usar para negociação, conecte uma fonte real de mercado e um backend para ingestão, armazenamento e cálculo dos indicadores.
