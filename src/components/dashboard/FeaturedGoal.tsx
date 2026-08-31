'use client';

import React from 'react';
import Link from 'next/link';
import ProgressGauge from '@/components/ui/ProgressGauge';
import { Goal } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { ArrowRight, Plus } from 'lucide-react';

interface FeaturedGoalProps {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onOpenNewGoal: () => void;
}

export default function FeaturedGoal({
  goals,
  onSelectGoal,
  onOpenNewGoal,
}: FeaturedGoalProps) {
  const featured = goals[0];
  const secondaryGoals = goals.slice(1, 4);

  if (!featured) {
    return (
      <div className="mf-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
          Suas Metas Financeiras
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
          Defina seu primeiro objetivo financeiro para acompanhar seu progresso.
        </p>
        <button onClick={onOpenNewGoal} className="mf-btn mf-btn-primary mf-btn-sm">
          <Plus size={15} />
          <span>Criar Primeira Meta</span>
        </button>
      </div>
    );
  }

  const featuredPct = featured.target_amount > 0 ? Math.min(100, Math.round((featured.current_amount / featured.target_amount) * 100)) : 0;

  return (
    <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Progresso de Metas
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
            Acompanhamento visual dos seus objetivos principais.
          </p>
        </div>
        <Link
          href="/goals"
          className="mf-btn mf-btn-secondary mf-btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
        >
          <span>Ver todas</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Featured Goal Radial Spotlight */}
      <div
        onClick={() => onSelectGoal(featured)}
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '1.25rem',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-hover)',
          padding: '1.1rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
        className="featured-goal-box"
      >
        <ProgressGauge
          percentage={featuredPct}
          size={110}
          strokeWidth={9}
          status={featured.status}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--color-medium-gray)',
              }}
            >
              Meta Principal
            </span>
            <span
              className={
                featured.status === 'completed'
                  ? 'mf-badge mf-badge-positive'
                  : featured.status === 'attention'
                  ? 'mf-badge mf-badge-warning'
                  : 'mf-badge mf-badge-neutral'
              }
            >
              {featured.status === 'completed' ? 'Concluída' : featured.status === 'attention' ? 'Atenção' : 'No Prazo'}
            </span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            {featured.title}
          </h4>

          <div style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)' }} className="tabular-nums">
            <strong style={{ color: 'var(--color-primary-black)' }}>{formatCurrency(featured.current_amount)}</strong> de {formatCurrency(featured.target_amount)}
          </div>
        </div>
      </div>

      {/* Secondary Goals Horizontal Progress Bars */}
      {secondaryGoals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Outras Metas em Andamento
          </span>

          {secondaryGoals.map((g) => {
            const pct = g.target_amount > 0 ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)) : 0;
            return (
              <div
                key={g.id}
                onClick={() => onSelectGoal(g)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-primary-black)' }}>{g.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-medium-gray)', fontSize: '0.75rem' }} className="tabular-nums">
                      {formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary-black)' }} className="tabular-nums">
                      {formatPercent(pct)}
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--color-light-gray)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: pct >= 100 ? 'var(--color-positive-text)' : 'var(--color-primary-black)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
