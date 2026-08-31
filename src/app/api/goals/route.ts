import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Goal } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json([]);
    }
    const userId = auth.userId;

    const pool = getDatabasePool();
    let goals: Goal[] = memoryStore.goals.filter((g) => g.user_id === userId);
    const contributions = memoryStore.goal_contributions;

    if (pool) {
      const gRes = await pool.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
      const cRes = await pool.query(`
        SELECT gc.* 
        FROM goal_contributions gc 
        INNER JOIN goals g ON gc.goal_id = g.id 
        WHERE g.user_id = $1 
        ORDER BY gc.contribution_date DESC
      `, [userId]);

      goals = gRes.rows.map((g) => ({
        ...g,
        contributions: cRes.rows.filter((c) => c.goal_id === g.id),
      }));
    } else {
      goals = goals.map((g) => ({
        ...g,
        contributions: contributions.filter((c) => c.goal_id === g.id),
      }));
    }

    const calculatedGoals = goals.map((g) => {
      const target = Number(g.target_amount);
      const current = Number(g.current_amount);
      const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      const remaining = Math.max(0, target - current);

      return {
        ...g,
        percentage: pct,
        remaining_amount: remaining,
        target_amount: target,
        current_amount: current,
      };
    });

    return NextResponse.json(calculatedGoals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Erro ao buscar metas financeiras' }, { status: 500 });
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
    const { title, target_amount, current_amount, deadline, priority, status } = body;
    const pool = getDatabasePool();

    const target = parseFloat(target_amount);
    const current = parseFloat(current_amount) || 0;

    const newGoal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      title: title || 'Nova Meta',
      target_amount: target,
      current_amount: current,
      deadline: deadline || '2027-12-31',
      priority: priority || 'medium',
      status: status || (current >= target ? 'completed' : 'on_track'),
      contributions: [],
      created_at: new Date().toISOString(),
    };

    if (pool) {
      await pool.query(
        `INSERT INTO goals (id, user_id, title, target_amount, current_amount, deadline, priority, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newGoal.id, userId, newGoal.title, target, current, newGoal.deadline, newGoal.priority, newGoal.status]
      );
    } else {
      memoryStore.goals.push(newGoal);
    }

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Erro ao criar meta' }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    const pool = getDatabasePool();
    if (pool) {
      await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [id, userId]);
      await pool.query('DELETE FROM goal_contributions WHERE goal_id = $1', [id]);
    }
    memoryStore.goals = memoryStore.goals.filter((g) => g.id !== id && g.user_id === userId);
    memoryStore.goal_contributions = memoryStore.goal_contributions.filter((c) => c.goal_id !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Erro ao excluir meta' }, { status: 500 });
  }
}
