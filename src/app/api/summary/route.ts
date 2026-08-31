import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { FinancialSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    const userId = auth ? auth.userId : null;

    if (!userId) {
      return NextResponse.json({
        current_balance: 0,
        monthly_income: 0,
        monthly_expenses: 0,
        monthly_savings: 0,
        savings_rate: 0,
        income_change_pct: 0,
        expenses_change_pct: 0,
      });
    }

    const pool = getDatabasePool();
    let incomes = memoryStore.income.filter((i) => i.user_id === userId);
    let expenses = memoryStore.expenses.filter((e) => e.user_id === userId);

    if (pool) {
      const incRes = await pool.query('SELECT * FROM income WHERE user_id = $1', [userId]);
      const expRes = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
      incomes = incRes.rows;
      expenses = expRes.rows;
    }

    const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const monthlyExpenses = expenses.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const currentBalance = monthlySavings;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    const summary: FinancialSummary = {
      current_balance: currentBalance,
      monthly_income: monthlyIncome,
      monthly_expenses: monthlyExpenses,
      monthly_savings: monthlySavings,
      savings_rate: savingsRate,
      income_change_pct: 0,
      expenses_change_pct: 0,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json({ error: 'Erro ao calcular resumo financeiro' }, { status: 500 });
  }
}
