# 🏛️ MyFinance — Plataforma de Gestão Financeira Pessoal & Planejamento Estratégico

> Uma plataforma full-stack moderna, determinística e minimalista para planejamento patrimonial, controle de receitas/despesas, orçamentação por categorias e simulações com projeções matemáticas.

---

## 📸 Visão Geral

O **MyFinance** foi projetado seguindo uma estética **monocromática de alta sofisticação**, inspirada em interfaces modernas de produtividade e dados (Linear, Vercel, Raycast). A plataforma prioriza a clareza analítica, eliminando ruídos visuais e oferecendo controle financeiro avançado.

### ✨ Principais Funcionalidades

- **🔐 Autenticação & Sessão Segura**:
  - Cadastro rápido com Nome, E-mail, Senha e Confirmação.
  - Criptografia com `bcryptjs` e sessões gerenciadas via tokens JWT seguros em cookies HTTP-only.
  - Suporte multi-usuário com isolamento estrito de dados por `user_id`.

- **🌙 Modo Escuro (Dark Mode) Nativo**:
  - Sistema de tokens de design com suporte a temas Claro e Escuro de alto contraste.
  - Alternador instantâneo com persistência automática no `localStorage`.

- **📊 Dashboard Analítico Consolidado**:
  - 4 métricas principais: Saldo Consolidado, Receitas do Mês, Despesas do Mês e Taxa de Poupança / Economia.
  - Gráfico interativo de evolução financeira por período (Semana, Mês e Ano).
  - Destaque da meta prioritária com medidor radial (*gauge*) e taxa de progresso.
  - Tabela das últimas movimentações com badges de status.

- **💸 Gestão de Movimentações (Ledger)**:
  - Registro ágil de receitas e despesas com categoria, data, método de pagamento e notas.
  - Filtros instantâneos por tipo (Receita/Despesa), categoria, recorrência e busca textual.
  - Resumo de totais filtrados e resultado líquido em tempo real.

- **🎯 Metas Financeiras com Forecast Matemático**:
  - Criação de metas com prazo, prioridade e valor alvo.
  - Registro de aportes periódicos com histórico detalhado.
  - **Motor de Projeção (*Forecast Engine*)**: cálculo automático do ritmo médio de aportes e estimativa exata da data de conclusão da meta.

- **🛡️ Sistema de Orçamentos com Alertas Preventivos**:
  - Definição de limites mensais por categoria de gasto.
  - Barra de progresso visual e cálculo de margem disponível.
  - Notificações automáticas de consumo aos **50%**, **80% (Alerta)** e **100%+ (Orçamento Estourado)**.

- **💡 Insights Determinísticos Automáticos**:
  - Diagnósticos automáticos gerados com base nos dados reais do fluxo de caixa.
  - Categorias de insight: Economia, Alerta de Gastos, Progresso de Metas e Comportamento.
  - Marcador de status de leitura (*Lido / Não lido*).

- **🧮 Simulador de Cenários Financeiros**:
  - Laboratório de hipóteses combinando aportes regulares, corte de gastos redirecionados e taxa de rentabilidade anual (juros compostos).
  - Comparativo visual lado a lado: *Cenário Base vs. Cenário Otimizado*.
  - Cálculo de quantos meses e quanto em juros compostos você ganha ao otimizar o fluxo.

- **📂 Categorias Personalizáveis**:
  - Cadastro de categorias com ícones visuais para classificação de lançamentos.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Framework Full-Stack** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Interface & Estilos** | Vanilla CSS com Design Tokens & Variáveis CSS personalizadas |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Banco de Dados** | [Neon PostgreSQL Serverless Cloud](https://neon.tech/) |
| **Driver de Conexão** | `pg` (Node-Postgres) com Connection Pooling otimizado |
| **Criptografia & JWT** | `bcryptjs` + `jose` |

---

## 🗄️ Estrutura do Banco de Dados (Neon PostgreSQL)

O schema do banco foi estruturado com integridade referencial, foreign keys e índices de performance:

1. `users` — Dados cadastrais, moeda padrão, dia de fechamento do mês e hash de senha.
2. `categories` — Classificações de despesas e receitas.
3. `income` — Lançamentos de receitas financeiras.
4. `expenses` — Lançamentos de despesas vinculadas a categorias.
5. `budgets` — Limites e tetos de gastos mensais por categoria.
6. `goals` — Objetivos e metas de patrimônio.
7. `goal_contributions` — Histórico de aportes e depósitos nas metas.
8. `strategies` — Planos táticos de economia e alocação.
9. `insights` — Diagnósticos e análises geradas pelo sistema.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18.17+ ou 20+)
- Conta no [Neon.tech](https://neon.tech/) (plano gratuito disponível)

### 1. Clonar o repositório
```bash
git clone https://github.com/felliperrocha/MyFinance.git
cd MyFinance
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto (use `.env.example` como base):

```env
# Neon PostgreSQL Database Connection URL
DATABASE_URL="postgresql://usuario:senha@ep-exemplo-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secret para sessões seguras
JWT_SECRET="seu-segredo-jwt-ultra-seguro"

# Porta do Servidor (opcional)
PORT=3000
```

### 4. Inicializar as tabelas no Neon (Migração Automática)
Execute o script de setup para criar automaticamente todas as 9 tabelas e índices no seu Neon PostgreSQL:
```bash
node scripts/init-neon.js
```

### 5. Executar a aplicação
#### Modo Desenvolvimento:
```bash
npm run dev
```

#### Modo Produção (Otimizado):
```bash
npm run build
npm run start
```

Acesse **[http://localhost:3000](http://localhost:3000)** no seu navegador.

---

## 📁 Estrutura de Pastas

```
d:/MyFinance/
├── public/                # Assets públicos estáticos
├── scripts/               # Scripts de banco (migração Neon PostgreSQL)
├── src/
│   ├── app/               # Next.js App Router (Páginas e Rotas de API)
│   │   ├── api/           # Endpoints REST (auth, summary, transactions, goals...)
│   │   ├── budgets/       # Página de Gestão de Orçamentos
│   │   ├── categories/    # Página de Categorias
│   │   ├── goals/         # Página de Metas & Aportes
│   │   ├── help/          # Central de Ajuda & Documentação
│   │   ├── insights/      # Diagnósticos Determinísticos
│   │   ├── settings/      # Configurações de Usuário e Banco
│   │   ├── simulations/   # Laboratório de Cenários Financeiros
│   │   ├── strategies/    # Estratégias Táticas
│   │   ├── transactions/  # Ledger de Movimentações
│   │   ├── globals.css    # Design System & Tokens (Light & Dark Mode)
│   │   ├── layout.tsx     # Shell principal com Sidebar, Providers e Header
│   │   └── page.tsx       # Dashboard Principal & Landing View
│   ├── components/        # Componentes React Modulares
│   │   ├── auth/          # Modal de Login e Cadastro
│   │   ├── budgets/       # Modais e cartões de orçamento
│   │   ├── dashboard/     # MetricCard, EvolutionChart, FeaturedGoal, FeaturedInsight
│   │   ├── goals/         # Modais de nova meta, aportes e detalhes com forecast
│   │   ├── layout/        # Sidebar, Header, MobileNav, LandingView
│   │   ├── strategies/    # Modais de estratégias
│   │   ├── transactions/  # Modais de receitas e despesas
│   │   └── ui/            # Modal genérico, ProgressGauge radial
│   ├── context/           # Context API (AuthContext, ThemeContext)
│   └── lib/               # Utilitários, Banco de Dados, Tipos e Motor de Forecast
├── .env.example           # Exemplo de configuração de variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── next.config.js         # Configuração do Next.js
├── package.json           # Dependências e scripts
└── README.md              # Documentação oficial do projeto
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo de licença para mais informações.
