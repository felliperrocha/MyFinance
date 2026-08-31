import { NextRequest, NextResponse } from 'next/server';
import { runFinancialSimulation, SimulationParams } from '@/lib/forecast-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const params: SimulationParams = {
      targetAmount: parseFloat(body.targetAmount) || 20000,
      initialAmount: parseFloat(body.initialAmount) || 5000,
      monthlyContribution: parseFloat(body.monthlyContribution) || 500,
      monthlySavingsReduction: parseFloat(body.monthlySavingsReduction) || 0,
      annualInterestRatePct: parseFloat(body.annualInterestRatePct) || 6.5,
    };

    const result = runFinancialSimulation(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json({ error: 'Erro ao executar simulação financeira' }, { status: 500 });
  }
}
