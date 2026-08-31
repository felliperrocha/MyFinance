import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Income, Expense } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ transactions: [], incomes: [], expenses: [] });
    }
    const userId = auth.userId;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const pool = getDatabasePool();

    let incomes: Income[] = memoryStore.income.filter((i) => i.user_id === userId);
    let expenses: Expense[] = memoryStore.expenses.filter((e) => e.user_id === userId);

    if (pool) {
      const incRes = await pool.query('SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC', [userId]);
      const expRes = await pool.query(
        `SELECT e.*, c.name as category_name 
         FROM expenses e 
         LEFT JOIN categories c ON e.category_id = c.id 
         WHERE e.user_id = $1 
         ORDER BY e.date DESC`,
        [userId]
      );
      incomes = incRes.rows;
      expenses = expRes.rows;
    }

    const unifiedList = [
      ...incomes.map((inc) => ({
        ...inc,
        transaction_type: 'income' as const,
        category_name: 'Receita',
      })),
      ...expenses.map((exp) => ({
        ...exp,
        transaction_type: 'expense' as const,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let filtered = unifiedList;
    if (type && type !== 'all') {
      filtered = filtered.filter((t) => t.transaction_type === type);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((t) => (t as any).category_id === category);
    }

    return NextResponse.json({
      transactions: filtered,
      incomes,
      expenses,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado. Faça login para cadastrar transações.' }, { status: 401 });
    }
    const userId = auth.userId;

    const body = await req.json();
    const { transaction_type, description, amount, date, category_id, income_type, recurrence, payment_method, notes } = body;

    const pool = getDatabasePool();
    const numAmount = Math.abs(parseFloat(amount));

    if (transaction_type === 'income') {
      const newIncome: Income = {
        id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        description: description || 'Receita sem descrição',
        amount: numAmount,
        date: date || new Date().toISOString().split('T')[0],
        income_type: income_type || 'salary',
        recurrence: recurrence || 'monthly',
        created_at: new Date().toISOString(),
      };

      if (pool) {
        await pool.query(
          `INSERT INTO income (id, user_id, description, amount, date, income_type, recurrence) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [newIncome.id, userId, newIncome.description, newIncome.amount, newIncome.date, newIncome.income_type, newIncome.recurrence]
        );
      } else {
        memoryStore.income.unshift(newIncome);
      }
      return NextResponse.json(newIncome, { status: 201 });
    } else {
      let categoryName = 'Outros';
      if (pool) {
        const cRes = await pool.query('SELECT name FROM categories WHERE id = $1', [category_id]);
        if (cRes.rows.length > 0) categoryName = cRes.rows[0].name;
      } else {
        const cat = memoryStore.categories.find((c) => c.id === category_id);
        if (cat) categoryName = cat.name;
      }

      const newExpense: Expense = {
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        category_id: category_id || 'cat-9',
        category_name: categoryName,
        description: description || 'Despesa sem descrição',
        amount: numAmount,
        date: date || new Date().toISOString().split('T')[0],
        payment_method: payment_method || 'credit',
        recurrence: recurrence || 'one-time',
        notes: notes || '',
        created_at: new Date().toISOString(),
      };

      if (pool) {
        await pool.query(
          `INSERT INTO expenses (id, user_id, category_id, description, amount, date, payment_method, recurrence, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            newExpense.id,
            userId,
            newExpense.category_id,
            newExpense.description,
            newExpense.amount,
            newExpense.date,
            newExpense.payment_method,
            newExpense.recurrence,
            newExpense.notes,
          ]
        );
      } else {
        memoryStore.expenses.unshift(newExpense);
      }
      return NextResponse.json(newExpense, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
    const userId = auth.userId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const pool = getDatabasePool();
    if (type === 'income' || id.startsWith('inc-')) {
      if (pool) await pool.query('DELETE FROM income WHERE id = $1 AND user_id = $2', [id, userId]);
      memoryStore.income = memoryStore.income.filter((i) => i.id !== id && i.user_id === userId);
    } else {
      if (pool) await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
      memoryStore.expenses = memoryStore.expenses.filter((e) => e.id !== id && e.user_id === userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Erro ao excluir transação' }, { status: 500 });
  }
}
