# Bom Regresso às Aulas 2026 — Pumangol Livros

Plataforma React responsiva para a campanha **Bom Regresso às Aulas 2026** da Pumangol. Permite consultar o catálogo de livros escolares, gerir encomendas e receber confirmação por Email e WhatsApp.

## Identidade Visual

- **Cor principal:** `#057143` (Verde Pumangol)
- **Tipografia:** Montserrat
- **Estilo:** Corporativo Pumangol + campanha escolar infantil

## Funcionalidades

- Landing page com hero, categorias e livros em destaque
- Catálogo com pesquisa e filtros (categoria, classe, nível de ensino)
- Carrinho de encomenda com gestão de quantidades
- Formulário de checkout com seleção de posto de levantamento
- Confirmação com notificações simuladas (Email + WhatsApp)
- Backoffice com listagem, filtros e exportação CSV/Excel

## Responsividade

O layout adapta-se a:
- **Desktop** (1920px+)
- **Tablet** (768px)
- **Mobile** (390px)

## Executar

```bash
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── context/        # Estado global (carrinho e encomendas)
├── data/           # Catálogo de livros e postos
├── pages/          # Landing, Catálogo, Encomenda, Confirmação, Backoffice
├── types/          # Tipos TypeScript
└── utils/          # Helpers (preços, notificações, exportação)
```

## Tecnologias

- React 19 + TypeScript
- React Router
- Vite
- Lucide React (ícones)
- CSS customizado com design tokens Pumangol
