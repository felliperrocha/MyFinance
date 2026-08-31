import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generateDeterministicInsights } from '@/lib/insights-engine';
import { Insight } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json([]);
    }
    const userId = auth.userId;
    const pool = getDatabasePool();

    let incomes = memoryStore.income.filter((i) => i.user_id === userId);
    let expenses = memoryStore.expenses.filter((e) => e.user_id === userId);
    let budgets = memoryStore.budgets.filter((b) => b.user_id === userId);
    let goals = memoryStore.goals.filter((g) => g.user_id === userId);
    let storedInsights = memoryStore.insights.filter((ins) => ins.user_id === userId);

    if (pool) {
      const iRes = await pool.query('SELECT * FROM income WHERE user_id = $1', [userId]);
      const eRes = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
      const bRes = await pool.query('SELECT * FROM budgets WHERE user_id = $1', [userId]);
      const gRes = await pool.query('SELECT * FROM goals WHERE user_id = $1', [userId]);
      const insRes = await pool.query('SELECT * FROM insights WHERE user_id = $1 ORDER BY created_at DESC', [userId]);

      incomes = iRes.rows;
      expenses = eRes.rows;
      budgets = bRes.rows;
      goals = gRes.rows;
      storedInsights = insRes.rows;
    }

    const dynamicInsights = generateDeterministicInsights(incomes, expenses, budgets, goals, userId);

    const allInsightsMap = new Map<string, Insight>();
    dynamicInsights.forEach((di) => allInsightsMap.set(di.title, di));
    storedInsights.forEach((si) => {
      if (!allInsightsMap.has(si.title)) {
        allInsightsMap.set(si.title, si);
      }
    });

    const finalInsights = Array.from(allInsightsMap.values());
    return NextResponse.json(finalInsights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Erro ao gerar insights' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
    const userId = auth.userId;

    const body = await req.json();
    const { id, is_read } = body;
    const pool = getDatabasePool();

    if (pool) {
      await pool.query('UPDATE insights SET is_read = $1 WHERE id = $2 AND user_id = $3', [is_read, id, userId]);
    }

    const ins = memoryStore.insights.find((i) => i.id === id && i.user_id === userId);
    if (ins) ins.is_read = is_read;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating insight status:', error);
    return NextResponse.json({ error: 'Erro ao atualizar insight' }, { status: 500 });
  }
}
