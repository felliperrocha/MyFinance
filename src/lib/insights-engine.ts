import { Expense, Income, Budget, Goal, Insight } from './types';

export function generateDeterministicInsights(
  incomes: Income[],
  expenses: Expense[],
  budgets: Budget[],
  goals: Goal[],
  userId: string
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();

  // 1. Total Income & Total Expenses
  const totalIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalExpenses = expenses.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Savings rate insight
  if (totalIncome > 0) {
    if (savingsRate >= 30) {
      insights.push({
        id: `ins-sav-${Date.now()}-1`,
        user_id: userId,
        title: 'Excelente Taxa de Poupança',
        content: `Você está poupando ${savingsRate.toFixed(0)}% da sua renda este mês. Essa reserva permite acelerar o cumprimento das suas metas estratégicas.`,
        insight_type: 'savings',
        is_read: false,
        created_at: now,
      });
    } else if (savingsRate < 10 && savingsRate > 0) {
      insights.push({
        id: `ins-sav-${Date.now()}-2`,
        user_id: userId,
        title: 'Atenção à Margem de Segurança',
        content: `Sua taxa de economia este mês está em ${savingsRate.toFixed(0)}%. Recomenda-se manter ao menos 20% da renda líquida direcionada a reservas ou aportes.`,
        insight_type: 'alert',
        is_read: false,
        created_at: now,
      });
    }
  }

  // 2. Budget Alerts (50%, 80%, 100%)
  budgets.forEach((b) => {
    const categoryExpenses = expenses
      .filter((e) => e.category_id === b.category_id)
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
    const pctUsed = b.monthly_limit > 0 ? (categoryExpenses / b.monthly_limit) * 100 : 0;

    if (pctUsed >= 100) {
      insights.push({
        id: `ins-bud-100-${b.id}`,
        user_id: userId,
        title: `Orçamento Excedido: ${b.category_name || 'Categoria'}`,
        content: `Você ultrapassou o limite estabelecido em ${b.category_name || 'Categoria'} (${pctUsed.toFixed(0)}% utilizado: R$ ${categoryExpenses.toFixed(2)} de R$ ${b.monthly_limit.toFixed(2)}).`,
        insight_type: 'alert',
        is_read: false,
        created_at: now,
      });
    } else if (pctUsed >= 80) {
      insights.push({
        id: `ins-bud-80-${b.id}`,
        user_id: userId,
        title: `Alerta de Limite: ${b.category_name || 'Categoria'}`,
        content: `Você já utilizou ${pctUsed.toFixed(0)}% do orçamento de ${b.category_name || 'Categoria'}. Restam R$ ${(b.monthly_limit - categoryExpenses).toFixed(2)}.`,
        insight_type: 'alert',
        is_read: false,
        created_at: now,
      });
    }
  });

  // 3. Goal Progress & Risk Insights
  goals.forEach((g) => {
    const pct = g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0;
    const remaining = Math.max(0, g.target_amount - g.current_amount);

    if (pct >= 90 && pct < 100) {
      insights.push({
        id: `ins-goal-near-${g.id}`,
        user_id: userId,
        title: `Meta Quase Concluída: ${g.title}`,
        content: `A meta "${g.title}" atingiu ${pct.toFixed(0)}% de conclusão. Faltam apenas R$ ${remaining.toFixed(2)} para finalizar!`,
        insight_type: 'goal',
        is_read: false,
        created_at: now,
      });
    }
  });

  // 4. Recurring Expenses behavior
  const recurringTotal = expenses
    .filter((e) => e.recurrence === 'monthly')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
  
  if (totalIncome > 0 && recurringTotal > 0) {
    const recurringPct = (recurringTotal / totalIncome) * 100;
    insights.push({
      id: `ins-rec-${Date.now()}`,
      user_id: userId,
      title: 'Composição de Custos Fixos',
      content: `Suas despesas recorrentes somam R$ ${recurringTotal.toFixed(2)} (${recurringPct.toFixed(0)}% da sua receita total).`,
      insight_type: 'behavior',
      is_read: true,
      created_at: now,
    });
  }

  return insights;
}
