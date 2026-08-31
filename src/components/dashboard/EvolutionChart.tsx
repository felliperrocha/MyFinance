'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';

type PeriodType = 'week' | 'month' | 'year';

interface DataPoint {
  label: string;
  income: number;
  expenses: number;
  savings: number;
}

const mockData: Record<PeriodType, DataPoint[]> = {
  week: [
    { label: 'Seg', income: 1200, expenses: 340, savings: 860 },
    { label: 'Ter', income: 450, expenses: 580, savings: -130 },
    { label: 'Qua', income: 800, expenses: 220, savings: 580 },
    { label: 'Qui', income: 1500, expenses: 690, savings: 810 },
    { label: 'Sex', income: 3200, expenses: 950, savings: 2250 },
    { label: 'Sáb', income: 600, expenses: 1100, savings: -500 },
    { label: 'Dom', income: 1000, expenses: 400, savings: 600 },
  ],
  month: [
    { label: 'Sem 1', income: 3500, expenses: 1400, savings: 2100 },
    { label: 'Sem 2', income: 2800, expenses: 1250, savings: 1550 },
    { label: 'Sem 3', income: 1900, expenses: 980, savings: 920 },
    { label: 'Sem 4', income: 2550, expenses: 1370, savings: 1180 },
  ],
  year: [
    { label: 'Jan', income: 7800, expenses: 4200, savings: 3600 },
    { label: 'Fev', income: 8100, expenses: 4400, savings: 3700 },
    { label: 'Mar', income: 8400, expenses: 4800, savings: 3600 },
    { label: 'Abr', income: 8200, expenses: 4100, savings: 4100 },
    { label: 'Mai', income: 9000, expenses: 4700, savings: 4300 },
    { label: 'Jun', income: 9500, expenses: 5100, savings: 4400 },
    { label: 'Jul', income: 9200, expenses: 4900, savings: 4300 },
    { label: 'Ago', income: 10750, expenses: 5000, savings: 5750 },
  ],
};

export default function EvolutionChart() {
  const [period, setPeriod] = useState<PeriodType>('year');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = mockData[period];
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expenses))) * 1.15 || 10000;
  const chartHeight = 180;

  return (
    <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Evolução Financeira
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
            Comparativo de receitas, despesas e fluxo de poupança.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '2px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
          }}
        >
          {(['week', 'month', 'year'] as PeriodType[]).map((p) => {
            const labelMap = { week: 'Semana', month: 'Mês', year: 'Ano' };
            const isSelected = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                  backgroundColor: isSelected ? 'var(--color-surface-card)' : 'transparent',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {labelMap[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--color-medium-gray)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-primary-black)' }} />
          <span>Receitas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-medium-gray)' }} />
          <span>Despesas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-positive-text)' }} />
          <span>Economia (Poupança)</span>
        </div>
      </div>

      {/* Minimalist SVG Bar/Column Visualization */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: '380px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: `${chartHeight}px`,
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '0.5rem',
              gap: '0.5rem',
            }}
          >
            {data.map((item, idx) => {
              const incomeHeight = (item.income / maxVal) * (chartHeight - 20);
              const expenseHeight = (item.expenses / maxVal) * (chartHeight - 20);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        marginBottom: '8px',
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-primary-black)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        whiteSpace: 'nowrap',
                        zIndex: 20,
                        boxShadow: 'var(--shadow-modal)',
                      }}
                    >
                      <div style={{ fontWeight: 600, borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '3px', marginBottom: '3px' }}>
                        {item.label}
                      </div>
                      <div>Receitas: {formatCurrency(item.income)}</div>
                      <div>Despesas: {formatCurrency(item.expenses)}</div>
                      <div style={{ color: 'var(--color-positive-text)', fontWeight: 600 }}>Economia: {formatCurrency(item.savings)}</div>
                    </div>
                  )}

                  {/* Dual Bar Group */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '100%', justifyContent: 'center' }}>
                    {/* Income Bar */}
                    <div
                      style={{
                        width: '38%',
                        maxWidth: '18px',
                        height: `${Math.max(4, incomeHeight)}px`,
                        backgroundColor: isHovered ? 'var(--color-primary-black)' : 'var(--color-primary-black)',
                        opacity: isHovered ? 1 : 0.85,
                        borderRadius: '3px 3px 0 0',
                        transition: 'all 0.2s ease',
                      }}
                    />
                    {/* Expense Bar */}
                    <div
                      style={{
                        width: '38%',
                        maxWidth: '18px',
                        height: `${Math.max(4, expenseHeight)}px`,
                        backgroundColor: 'var(--color-medium-gray)',
                        opacity: isHovered ? 0.9 : 0.6,
                        borderRadius: '3px 3px 0 0',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
            {data.map((item, idx) => (
              <span
                key={idx}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '0.6875rem',
                  color: hoveredIndex === idx ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                  fontWeight: hoveredIndex === idx ? 600 : 400,
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
