import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Budget } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json([]);
    }
    const userId = auth.userId;

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || '8', 10);
    const year = parseInt(searchParams.get('year') || '2026', 10);

    const pool = getDatabasePool();
    let budgets: Budget[] = memoryStore.budgets.filter((b) => b.user_id === userId && b.month === month && b.year === year);
    let expenses = memoryStore.expenses.filter((e) => e.user_id === userId);
    let categories = memoryStore.categories.filter((c) => c.user_id === userId);

    if (pool) {
      const bRes = await pool.query(
        `SELECT b.*, c.name as category_name 
         FROM budgets b 
         LEFT JOIN categories c ON b.category_id = c.id 
         WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3`,
        [userId, month, year]
      );
      const eRes = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
      const cRes = await pool.query('SELECT * FROM categories WHERE user_id = $1', [userId]);
      budgets = bRes.rows;
      expenses = eRes.rows;
      categories = cRes.rows;
    }

    const budgetsWithSpent = budgets.map((b) => {
      const catExpenses = expenses
        .filter((e) => e.category_id === b.category_id)
        .reduce((sum, item) => sum + Number(item.amount), 0);
      const limit = Number(b.monthly_limit);
      const pct = limit > 0 ? (catExpenses / limit) * 100 : 0;
      const cat = categories.find((c) => c.id === b.category_id);

      return {
        ...b,
        category_name: b.category_name || (cat ? cat.name : 'Categoria'),
        spent_amount: catExpenses,
        percentage_used: Math.round(pct),
      };
    });

    return NextResponse.json(budgetsWithSpent);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Erro ao buscar orçamentos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
    const userId = auth.userId;

    const body = await req.json();
    const { category_id, monthly_limit, month, year } = body;
    const pool = getDatabasePool();

    const category = memoryStore.categories.find((c) => c.id === category_id && c.user_id === userId);
    const existingIndex = memoryStore.budgets.findIndex(
      (b) => b.category_id === category_id && b.month === month && b.year === year && b.user_id === userId
    );

    const limitNum = parseFloat(monthly_limit);

    if (existingIndex >= 0) {
      memoryStore.budgets[existingIndex].monthly_limit = limitNum;
      if (pool) {
        await pool.query(
          'UPDATE budgets SET monthly_limit = $1, updated_at = NOW() WHERE category_id = $2 AND month = $3 AND year = $4 AND user_id = $5',
          [limitNum, category_id, month, year, userId]
        );
      }
      return NextResponse.json(memoryStore.budgets[existingIndex]);
    } else {
      const newBudget: Budget = {
        id: `bud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        category_id,
        category_name: category ? category.name : 'Categoria',
        monthly_limit: limitNum,
        month: month || 8,
        year: year || 2026,
        created_at: new Date().toISOString(),
      };

      if (pool) {
        await pool.query(
          'INSERT INTO budgets (id, user_id, category_id, monthly_limit, month, year) VALUES ($1, $2, $3, $4, $5, $6)',
          [newBudget.id, userId, newBudget.category_id, newBudget.monthly_limit, newBudget.month, newBudget.year]
        );
      } else {
        memoryStore.budgets.push(newBudget);
      }
      return NextResponse.json(newBudget, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving budget:', error);
    return NextResponse.json({ error: 'Erro ao salvar orçamento' }, { status: 500 });
  }
}
