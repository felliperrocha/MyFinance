import { Goal } from './types';

export interface GoalForecastResult {
  averageMonthlyContribution: number;
  monthsRemaining: number;
  estimatedCompletionDate: string;
  isAchievableOnDeadline: boolean;
  requiredMonthlyForDeadline: number;
  statusText: string;
}

export function calculateGoalForecast(goal: Goal): GoalForecastResult {
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  
  // Calculate average contribution rate from history or default to baseline
  let avgContribution = 0;
  if (goal.contributions && goal.contributions.length > 0) {
    const totalContributed = goal.contributions.reduce((acc, cur) => acc + Number(cur.amount), 0);
    avgContribution = totalContributed / goal.contributions.length;
  } else {
    avgContribution = remaining > 0 ? remaining / 12 : 0;
  }

  if (avgContribution <= 0) avgContribution = 500;

  const monthsRemaining = Math.ceil(remaining / avgContribution);
  
  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + monthsRemaining);
  const estimatedCompletionDate = estimatedDate.toISOString().split('T')[0];

  // Check deadline
  let monthsToDeadline = 12;
  if (goal.deadline) {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    monthsToDeadline = Math.max(1, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.4)));
  }

  const requiredMonthlyForDeadline = monthsToDeadline > 0 ? remaining / monthsToDeadline : remaining;
  const isAchievableOnDeadline = monthsRemaining <= monthsToDeadline;

  let statusText = '';
  if (remaining === 0) {
    statusText = 'Meta já concluída!';
  } else if (isAchievableOnDeadline) {
    statusText = `No ritmo atual de aportes (méd. R$ ${avgContribution.toFixed(2)}/mês), você concluirá esta meta em aproximadamente ${monthsRemaining} ${monthsRemaining === 1 ? 'mês' : 'meses'}.`;
  } else {
    statusText = `No ritmo atual, você concluirá em ${monthsRemaining} meses. Para atingir a meta no prazo estipulado, recomenda-se aportar R$ ${requiredMonthlyForDeadline.toFixed(2)}/mês.`;
  }

  return {
    averageMonthlyContribution: avgContribution,
    monthsRemaining,
    estimatedCompletionDate,
    isAchievableOnDeadline,
    requiredMonthlyForDeadline,
    statusText,
  };
}

export interface SimulationParams {
  targetAmount: number;
  initialAmount: number;
  monthlyContribution: number;
  monthlySavingsReduction: number;
  annualInterestRatePct: number;
}

export interface SimulationResult {
  baselineMonths: number;
  baselineDate: string;
  optimizedMonths: number;
  optimizedDate: string;
  monthsSaved: number;
  totalInterestEarned: number;
}

export function runFinancialSimulation(params: SimulationParams): SimulationResult {
  const { targetAmount, initialAmount, monthlyContribution, monthlySavingsReduction, annualInterestRatePct } = params;
  const remaining = Math.max(0, targetAmount - initialAmount);
  
  const baselineContribution = Math.max(10, monthlyContribution);
  const optimizedContribution = Math.max(10, monthlyContribution + monthlySavingsReduction);

  const monthlyRate = (annualInterestRatePct / 100) / 12;

  // Baseline calculation (without interest or simple)
  const baselineMonths = monthlyRate > 0
    ? Math.ceil(Math.log(1 + (remaining * monthlyRate) / baselineContribution) / Math.log(1 + monthlyRate))
    : Math.ceil(remaining / baselineContribution);

  // Optimized calculation
  const optimizedMonths = monthlyRate > 0
    ? Math.ceil(Math.log(1 + (remaining * monthlyRate) / optimizedContribution) / Math.log(1 + monthlyRate))
    : Math.ceil(remaining / optimizedContribution);

  const monthsSaved = Math.max(0, baselineMonths - optimizedMonths);

  const bDate = new Date();
  bDate.setMonth(bDate.getMonth() + baselineMonths);
  const baselineDate = bDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

  const oDate = new Date();
  oDate.setMonth(oDate.getMonth() + optimizedMonths);
  const optimizedDate = oDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

  const totalPaid = initialAmount + (optimizedContribution * optimizedMonths);
  const totalInterestEarned = Math.max(0, targetAmount - totalPaid);

  return {
    baselineMonths: Math.max(1, baselineMonths),
    baselineDate,
    optimizedMonths: Math.max(1, optimizedMonths),
    optimizedDate,
    monthsSaved,
    totalInterestEarned,
  };
}
