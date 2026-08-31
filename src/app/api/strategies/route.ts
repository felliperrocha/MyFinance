import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Strategy } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json([]);
    }
    const userId = auth.userId;

    const pool = getDatabasePool();
    let strategies: Strategy[] = memoryStore.strategies.filter((s) => s.user_id === userId);

    if (pool) {
      const res = await pool.query(
        `SELECT s.*, g.title as goal_title 
         FROM strategies s 
         LEFT JOIN goals g ON s.goal_id = g.id 
         WHERE s.user_id = $1 
         ORDER BY s.created_at DESC`,
        [userId]
      );
      strategies = res.rows;
    }

    return NextResponse.json(strategies);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return NextResponse.json({ error: 'Erro ao buscar estratégias' }, { status: 500 });
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
    const { title, description, strategy_type, goal_id, estimated_monthly_impact, status } = body;
    const pool = getDatabasePool();

    let goalTitle: string | undefined = undefined;
    if (goal_id) {
      if (pool) {
        const gRes = await pool.query('SELECT title FROM goals WHERE id = $1', [goal_id]);
        if (gRes.rows.length > 0) goalTitle = gRes.rows[0].title;
      } else {
        const goal = memoryStore.goals.find((g) => g.id === goal_id);
        if (goal) goalTitle = goal.title;
      }
    }

    const newStrategy: Strategy = {
      id: `strat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      goal_id: goal_id || null,
      goal_title: goalTitle,
      title: title || 'Nova Estratégia',
      description: description || '',
      strategy_type: strategy_type || 'savings',
      estimated_monthly_impact: parseFloat(estimated_monthly_impact) || 0,
      status: status || 'active',
      created_at: new Date().toISOString(),
    };

    if (pool) {
      await pool.query(
        `INSERT INTO strategies (id, user_id, goal_id, title, description, strategy_type, estimated_monthly_impact, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newStrategy.id,
          userId,
          newStrategy.goal_id,
          newStrategy.title,
          newStrategy.description,
          newStrategy.strategy_type,
          newStrategy.estimated_monthly_impact,
          newStrategy.status,
        ]
      );
    } else {
      memoryStore.strategies.unshift(newStrategy);
    }

    return NextResponse.json(newStrategy, { status: 201 });
  } catch (error) {
    console.error('Error creating strategy:', error);
    return NextResponse.json({ error: 'Erro ao criar estratégia' }, { status: 500 });
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
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 });

    const pool = getDatabasePool();
    if (pool) {
      await pool.query('UPDATE strategies SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3', [status, id, userId]);
    }

    const strat = memoryStore.strategies.find((s) => s.id === id && s.user_id === userId);
    if (strat) strat.status = status;

    return NextResponse.json({ success: true, strategy: strat });
  } catch (error) {
    console.error('Error updating strategy:', error);
    return NextResponse.json({ error: 'Erro ao atualizar estratégia' }, { status: 500 });
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
    if (pool) await pool.query('DELETE FROM strategies WHERE id = $1 AND user_id = $2', [id, userId]);
    memoryStore.strategies = memoryStore.strategies.filter((s) => s.id !== id && s.user_id === userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    return NextResponse.json({ error: 'Erro ao excluir estratégia' }, { status: 500 });
  }
}
