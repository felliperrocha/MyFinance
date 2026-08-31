'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Goal } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { runFinancialSimulation, SimulationResult } from '@/lib/forecast-engine';
import { Sliders } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SimulationsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  // Simulation Parameters
  const [targetAmount, setTargetAmount] = useState<number>(20000);
  const [initialAmount, setInitialAmount] = useState<number>(5000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(600);
  const [monthlySavingsReduction, setMonthlySavingsReduction] = useState<number>(250);
  const [annualInterestRatePct, setAnnualInterestRatePct] = useState<number>(8.5);

  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    fetch('/api/goals')
      .then((res) => res.json())
      .then((data: Goal[]) => {
        setGoals(data || []);
        if (data && data.length > 0) {
          const first = data[0];
          setSelectedGoalId(first.id);
          setTargetAmount(Number(first.target_amount));
          setInitialAmount(Number(first.current_amount));
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  // Update simulation when goal selection changes
  const handleSelectGoal = (id: string) => {
    setSelectedGoalId(id);
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setTargetAmount(Number(goal.target_amount));
      setInitialAmount(Number(goal.current_amount));
    }
  };

  // Re-run simulation
  useEffect(() => {
    const res = runFinancialSimulation({
      targetAmount,
      initialAmount,
      monthlyContribution,
      monthlySavingsReduction,
      annualInterestRatePct,
    });
    setResult(res);
  }, [targetAmount, initialAmount, monthlyContribution, monthlySavingsReduction, annualInterestRatePct]);

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
            Simulador de Cenários Financeiros
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
            Teste hipóteses de aportes, corte de despesas e rendimentos para antecipar a conquista das suas metas.
          </p>
        </div>

        {/* Simulator Grid (Controls on Left, Results on Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Controls Form */}
          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Parâmetros da Simulação
            </h3>

            {/* Select Goal */}
            {goals.length > 0 && (
              <div>
                <label className="mf-label">Importar Parâmetros de uma Meta Existente</label>
                <select
                  className="mf-select"
                  value={selectedGoalId}
                  onChange={(e) => handleSelectGoal(e.target.value)}
                >
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} (Alvo: {formatCurrency(g.target_amount)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target & Initial */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="mf-label">Valor Alvo (R$)</label>
                <input
                  type="number"
                  step="100"
                  className="mf-input tabular-nums"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="mf-label">Patrimônio Atual (R$)</label>
                <input
                  type="number"
                  step="100"
                  className="mf-input tabular-nums"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Monthly Contribution Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="mf-label" style={{ margin: 0 }}>Aporte Mensal Base (R$/mês)</label>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary-black)' }} className="tabular-nums">
                  {formatCurrency(monthlyContribution)}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                style={{ width: '100%', accentColor: 'var(--color-primary-black)', cursor: 'pointer' }}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
              />
            </div>

            {/* Monthly Savings Reduction Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="mf-label" style={{ margin: 0 }}>Economia Redirecionada de Gastos (R$/mês)</label>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-positive-text)' }} className="tabular-nums">
                  + {formatCurrency(monthlySavingsReduction)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                style={{ width: '100%', accentColor: 'var(--color-positive-text)', cursor: 'pointer' }}
                value={monthlySavingsReduction}
                onChange={(e) => setMonthlySavingsReduction(parseFloat(e.target.value))}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', display: 'block', marginTop: '0.25rem' }}>
                Aporte Total Otimizado: <strong>{formatCurrency(monthlyContribution + monthlySavingsReduction)}/mês</strong>
              </span>
            </div>

            {/* Annual Interest Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="mf-label" style={{ margin: 0 }}>Taxa de Rentabilidade Anual (% a.a.)</label>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary-black)' }} className="tabular-nums">
                  {formatPercent(annualInterestRatePct, 1)} a.a.
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="0.5"
                style={{ width: '100%', accentColor: 'var(--color-primary-black)', cursor: 'pointer' }}
                value={annualInterestRatePct}
                onChange={(e) => setAnnualInterestRatePct(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Result Comparison Card */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Highlight Months Saved Box */}
              <div
                className="mf-card"
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary-black)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ganho de Tempo com o Cenário Otimizado
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--color-positive-text)' }}>
                  {result.monthsSaved} {result.monthsSaved === 1 ? 'Mês' : 'Meses'} Mais Rápido!
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.4 }}>
                  Com o redirecionamento de economia e rentabilidade, você antecipa sua meta de{' '}
                  <strong style={{ color: 'var(--color-primary-black)' }}>{result.baselineDate}</strong> para{' '}
                  <strong style={{ color: 'var(--color-positive-text)' }}>{result.optimizedDate}</strong>.
                </p>
              </div>

              {/* Side-by-Side Comparison */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                {/* Baseline Scenario */}
                <div className="mf-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase' }}>
                    Cenário Atual (Base)
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
                    {result.baselineMonths} Meses
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
                    Previsão: {result.baselineDate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
                    Aporte: {formatCurrency(monthlyContribution)}/mês
                  </span>
                </div>

                {/* Optimized Scenario */}
                <div
                  className="mf-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    border: '1px solid var(--color-positive-border)',
                    backgroundColor: 'var(--color-positive-bg)',
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-positive-text)', textTransform: 'uppercase' }}>
                    Cenário Otimizado
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-positive-text)' }}>
                    {result.optimizedMonths} Meses
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-positive-text)', fontWeight: 600 }}>
                    Previsão: {result.optimizedDate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-positive-text)' }}>
                    Aporte: {formatCurrency(monthlyContribution + monthlySavingsReduction)}/mês
                  </span>
                </div>
              </div>

              {/* Mathematical Insight */}
              <div className="mf-card" style={{ padding: '1.1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
                <strong>Análise do Simulador:</strong> Ao aplicar juros compostos a uma taxa de {annualInterestRatePct}% a.a., os rendimentos acumulados cobrem aproximadamente <strong>{formatCurrency(result.totalInterestEarned)}</strong> do valor final da sua meta.
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
