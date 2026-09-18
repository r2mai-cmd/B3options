# B3Vol — B3 Options Volatility Terminal

Projeto React + Vite para análise de opções da B3.

## Estrutura

```text
.
├── docs/
│   └── b3options/
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

O app fica em `docs/b3options`, enquanto o GitHub Actions gera o build em `dist/` e publica esse build no GitHub Pages.

## GitHub Pages

Em **Settings → Pages** escolha:

**Source: GitHub Actions**

Depois faça push na `main`. O workflow **Deploy B3Vol to GitHub Pages** fará:

1. instalar as dependências de `docs/b3options`;
2. executar `npm run build`;
3. gerar o `dist`;
4. publicar o `dist` no GitHub Pages.

URL esperada:

`https://r2mai-cmd.github.io/B3options/`

Os dados do MVP são demonstrativos/mockados.
