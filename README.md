# B3Options

Terminal web de análise de volatilidade e opções para ações negociadas na B3.

## Estrutura

```text
.github/workflows/deploy.yml
docs/b3options/
  index.html
  package.json
  package-lock.json
  vite.config.ts
  tsconfig*.json
  src/
```

## GitHub Pages

O workflow publica automaticamente `docs/b3options/dist` no GitHub Pages.

No repositório, use:

**Settings → Pages → Source → GitHub Actions**

## Desenvolvimento local

```bash
cd docs/b3options
npm install
npm run dev
```

Os números exibidos no MVP são demonstrativos. Para uso operacional, conecte uma fonte de dados licenciada/adequada para cotações, cadeia de opções, IV, HV, OI e volume.
