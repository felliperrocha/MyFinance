import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { GoalContribution } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goalId = params.id;
    const body = await req.json();
    const { amount, contribution_date, notes } = body;
    const numAmount = Math.abs(parseFloat(amount));
    const pool = getDatabasePool();

    const newContribution: GoalContribution = {
      id: `con-${Date.now()}`,
      goal_id: goalId,
      amount: numAmount,
      contribution_date: contribution_date || new Date().toISOString().split('T')[0],
      notes: notes || '',
      created_at: new Date().toISOString(),
    };

    if (pool) {
      await pool.query(
        'INSERT INTO goal_contributions (id, goal_id, amount, contribution_date, notes) VALUES ($1, $2, $3, $4, $5)',
        [newContribution.id, goalId, newContribution.amount, newContribution.contribution_date, newContribution.notes]
      );
      await pool.query(
        'UPDATE goals SET current_amount = current_amount + $1, updated_at = NOW() WHERE id = $2',
        [numAmount, goalId]
      );
    }

    // Update memoryStore
    memoryStore.goal_contributions.unshift(newContribution);
    const goal = memoryStore.goals.find((g) => g.id === goalId);
    if (goal) {
      goal.current_amount = Number(goal.current_amount) + numAmount;
      if (goal.current_amount >= goal.target_amount) {
        goal.status = 'completed';
      }
      if (!goal.contributions) goal.contributions = [];
      goal.contributions.unshift(newContribution);
    }

    return NextResponse.json(newContribution, { status: 201 });
  } catch (error) {
    console.error('Error adding contribution:', error);
    return NextResponse.json({ error: 'Erro ao registrar contribuição' }, { status: 500 });
  }
}
