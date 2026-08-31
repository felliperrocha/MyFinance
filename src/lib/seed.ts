import { Category, Income, Expense, Budget, Goal, Strategy, Insight } from './types';

export const DEFAULT_CATEGORIES: Array<Omit<Category, 'user_id'>> = [
  { id: 'cat-1', name: 'Moradia', icon: 'Home', type: 'expense' },
  { id: 'cat-2', name: 'Alimentação', icon: 'Utensils', type: 'expense' },
  { id: 'cat-3', name: 'Transporte', icon: 'Car', type: 'expense' },
  { id: 'cat-4', name: 'Saúde', icon: 'Activity', type: 'expense' },
  { id: 'cat-5', name: 'Educação', icon: 'GraduationCap', type: 'expense' },
  { id: 'cat-6', name: 'Lazer', icon: 'Film', type: 'expense' },
  { id: 'cat-7', name: 'Compras', icon: 'ShoppingBag', type: 'expense' },
  { id: 'cat-8', name: 'Financeiro', icon: 'TrendingUp', type: 'expense' },
  { id: 'cat-9', name: 'Outros', icon: 'MoreHorizontal', type: 'expense' },
];

export const INITIAL_INCOME: Array<Omit<Income, 'user_id'>> = [
  {
    id: 'inc-1',
    description: 'Salário Mensal',
    amount: 8500.00,
    date: '2026-08-05',
    income_type: 'salary',
    recurrence: 'monthly',
  },
  {
    id: 'inc-2',
    description: 'Consultoria Financeira Extra',
    amount: 1800.00,
    date: '2026-08-18',
    income_type: 'extra',
    recurrence: 'one-time',
  },
  {
    id: 'inc-3',
    description: 'Rendimento de Dividendos',
    amount: 450.00,
    date: '2026-08-22',
    income_type: 'benefit',
    recurrence: 'monthly',
  }
];

export const INITIAL_EXPENSES: Array<Omit<Expense, 'user_id'>> = [
  {
    id: 'exp-1',
    category_id: 'cat-1',
    category_name: 'Moradia',
    description: 'Aluguel e Condomínio',
    amount: 2400.00,
    date: '2026-08-10',
    payment_method: 'transfer',
    recurrence: 'monthly',
    notes: 'Pago pontualmente',
  },
  {
    id: 'exp-2',
    category_id: 'cat-2',
    category_name: 'Alimentação',
    description: 'Supermercado Mensal',
    amount: 980.00,
    date: '2026-08-12',
    payment_method: 'credit',
    recurrence: 'monthly',
    notes: 'Compras gerais da casa',
  },
  {
    id: 'exp-3',
    category_id: 'cat-3',
    category_name: 'Transporte',
    description: 'Combustível e Estacionamento',
    amount: 420.00,
    date: '2026-08-15',
    payment_method: 'credit',
    recurrence: 'monthly',
  },
  {
    id: 'exp-4',
    category_id: 'cat-4',
    category_name: 'Saúde',
    description: 'Plano de Saúde e Farmácia',
    amount: 580.00,
    date: '2026-08-08',
    payment_method: 'debit',
    recurrence: 'monthly',
  },
  {
    id: 'exp-5',
    category_id: 'cat-6',
    category_name: 'Lazer',
    description: 'Restaurantes e Cinema',
    amount: 490.00,
    date: '2026-08-20',
    payment_method: 'credit',
    recurrence: 'one-time',
  },
  {
    id: 'exp-6',
    category_id: 'cat-5',
    category_name: 'Educação',
    description: 'Curso de Especialização',
    amount: 350.00,
    date: '2026-08-07',
    payment_method: 'credit',
    recurrence: 'monthly',
  },
  {
    id: 'exp-7',
    category_id: 'cat-7',
    category_name: 'Compras',
    description: 'Vestuário e Acessórios',
    amount: 280.00,
    date: '2026-08-24',
    payment_method: 'credit',
    recurrence: 'one-time',
  }
];

export const INITIAL_BUDGETS: Array<Omit<Budget, 'user_id'>> = [
  { id: 'bud-1', category_id: 'cat-1', category_name: 'Moradia', monthly_limit: 2500.00, month: 8, year: 2026 },
  { id: 'bud-2', category_id: 'cat-2', category_name: 'Alimentação', monthly_limit: 1200.00, month: 8, year: 2026 },
  { id: 'bud-3', category_id: 'cat-3', category_name: 'Transporte', monthly_limit: 500.00, month: 8, year: 2026 },
  { id: 'bud-4', category_id: 'cat-4', category_name: 'Saúde', monthly_limit: 700.00, month: 8, year: 2026 },
  { id: 'bud-5', category_id: 'cat-6', category_name: 'Lazer', monthly_limit: 500.00, month: 8, year: 2026 },
  { id: 'bud-6', category_id: 'cat-5', category_name: 'Educação', monthly_limit: 400.00, month: 8, year: 2026 },
  { id: 'bud-7', category_id: 'cat-7', category_name: 'Compras', monthly_limit: 400.00, month: 8, year: 2026 },
];

export const INITIAL_GOALS: Array<Omit<Goal, 'user_id'>> = [
  {
    id: 'goal-1',
    title: 'Reserva de Emergência',
    target_amount: 30000.00,
    current_amount: 21600.00,
    deadline: '2026-12-31',
    priority: 'high',
    status: 'on_track',
    contributions: [
      { id: 'con-1', goal_id: 'goal-1', amount: 1500.00, contribution_date: '2026-06-05', notes: 'Aporte mensal' },
      { id: 'con-2', goal_id: 'goal-1', amount: 1500.00, contribution_date: '2026-07-05', notes: 'Aporte mensal' },
      { id: 'con-3', goal_id: 'goal-1', amount: 1800.00, contribution_date: '2026-08-05', notes: 'Aporte com bônus' },
    ]
  },
  {
    id: 'goal-2',
    title: 'Viagem Internacional',
    target_amount: 15000.00,
    current_amount: 6750.00,
    deadline: '2027-04-30',
    priority: 'medium',
    status: 'on_track',
    contributions: [
      { id: 'con-4', goal_id: 'goal-2', amount: 750.00, contribution_date: '2026-07-15', notes: 'Aporte de férias' },
      { id: 'con-5', goal_id: 'goal-2', amount: 750.00, contribution_date: '2026-08-15', notes: 'Aporte regular' },
    ]
  },
  {
    id: 'goal-3',
    title: 'Entrada Imóvel Próprio',
    target_amount: 80000.00,
    current_amount: 20000.00,
    deadline: '2028-12-31',
    priority: 'high',
    status: 'attention',
    contributions: [
      { id: 'con-6', goal_id: 'goal-3', amount: 2000.00, contribution_date: '2026-08-01', notes: 'Início do plano' },
    ]
  },
  {
    id: 'goal-4',
    title: 'Novo Computador de Trabalho',
    target_amount: 8500.00,
    current_amount: 7650.00,
    deadline: '2026-10-15',
    priority: 'low',
    status: 'on_track',
    contributions: [
      { id: 'con-7', goal_id: 'goal-4', amount: 1200.00, contribution_date: '2026-08-10', notes: 'Aporte de consultoria' },
    ]
  }
];

export const INITIAL_STRATEGIES: Array<Omit<Strategy, 'user_id'>> = [
  {
    id: 'strat-1',
    goal_id: 'goal-1',
    goal_title: 'Reserva de Emergência',
    title: 'Aporte Automático no Recebimento',
    description: 'Transferir R$ 1.500 imediatamente para a conta de reserva no dia do salário.',
    strategy_type: 'organization',
    estimated_monthly_impact: 1500.00,
    status: 'active',
  },
  {
    id: 'strat-2',
    goal_id: 'goal-2',
    goal_title: 'Viagem Internacional',
    title: 'Otimização de Assinaturas e Delivery',
    description: 'Reduzir pedidos de delivery nos finais de semana e cancelar serviços de streaming duplicados.',
    strategy_type: 'savings',
    estimated_monthly_impact: 320.00,
    status: 'active',
  },
  {
    id: 'strat-3',
    goal_id: 'goal-3',
    goal_title: 'Entrada Imóvel Próprio',
    title: 'Alocação em Tesouro IPCA+',
    description: 'Direcionar os aportes de longo prazo para títulos públicos indexados à inflação.',
    strategy_type: 'investment',
    estimated_monthly_impact: 2000.00,
    status: 'active',
  }
];

export const INITIAL_INSIGHTS: Array<Omit<Insight, 'user_id'>> = [
  {
    id: 'ins-1',
    title: 'Taxa de Poupança Sólida',
    content: 'Você economizou 48% da sua receita neste mês, o que está significativamente acima da recomendação padrão de 20%.',
    insight_type: 'savings',
    is_read: false,
    created_at: '2026-08-28T10:00:00Z',
  },
  {
    id: 'ins-2',
    title: 'Meta Próxima da Conclusão',
    content: 'Sua meta "Novo Computador de Trabalho" atingiu 90% do valor total. Faltam apenas R$ 850 para conclusão.',
    insight_type: 'goal',
    is_read: false,
    created_at: '2026-08-25T14:30:00Z',
  },
  {
    id: 'ins-3',
    title: 'Alerta de Orçamento: Lazer',
    content: 'Você utilizou 98% do seu limite de gastos na categoria Lazer para o mês de Agosto.',
    insight_type: 'alert',
    is_read: true,
    created_at: '2026-08-22T18:15:00Z',
  },
  {
    id: 'ins-4',
    title: 'Gastos Recorrentes Otimizados',
    content: 'Suas despesas essenciais representam 38% da sua renda líquida, proporcionando alta flexibilidade financeira.',
    insight_type: 'behavior',
    is_read: true,
    created_at: '2026-08-15T09:00:00Z',
  }
];
