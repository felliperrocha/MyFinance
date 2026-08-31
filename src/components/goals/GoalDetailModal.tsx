'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import ProgressGauge from '@/components/ui/ProgressGauge';
import { Goal } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { calculateGoalForecast } from '@/lib/forecast-engine';
import { Plus, Clock } from 'lucide-react';

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onOpenContribution: () => void;
}

export default function GoalDetailModal({
  isOpen,
  onClose,
  goal,
  onOpenContribution,
}: GoalDetailModalProps) {
  if (!goal) return null;

  const forecast = calculateGoalForecast(goal);
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const percentage = goal.target_amount > 0 ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.title}
      subtitle="Visão detalhada, progresso visual e projeções matemáticas."
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Radial Progress & Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
          }}
        >
          <ProgressGauge
            percentage={percentage}
            size={150}
            strokeWidth={11}
            label="Concluído"
            status={goal.status}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', display: 'block' }}>Valor Acumulado</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-black)' }} className="tabular-nums">
                  {formatCurrency(goal.current_amount)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', display: 'block' }}>Valor Alvo</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-black)' }} className="tabular-nums">
                  {formatCurrency(goal.target_amount)}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', display: 'block' }}>Restante para Concluir</span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: remaining === 0 ? 'var(--color-positive-text)' : 'var(--color-medium-gray)' }} className="tabular-nums">
                  {formatCurrency(remaining)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', display: 'block' }}>Data Limite</span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                  {formatDate(goal.deadline)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenContribution();
              }}
              className="mf-btn mf-btn-primary mf-btn-sm"
              style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
            >
              <Plus size={15} />
              <span>Registrar Novo Aporte</span>
            </button>
          </div>
        </div>

        {/* Forecast Engine Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Clock size={16} color="var(--color-primary-black)" />
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Previsão Matemática de Conclusão (Forecast)
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
            {forecast.statusText}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
            <span>Aporte Médio Mensal: <strong style={{ color: 'var(--color-primary-black)' }}>{formatCurrency(forecast.averageMonthlyContribution)}</strong></span>
            <span>Data Estimada: <strong style={{ color: 'var(--color-primary-black)' }}>{formatDate(forecast.estimatedCompletionDate)}</strong></span>
          </div>
        </div>

        {/* Contribution History */}
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-black)', marginBottom: '0.75rem' }}>
            Histórico de Contribuições ({goal.contributions?.length || 0})
          </h4>
          {goal.contributions && goal.contributions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {goal.contributions.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.875rem',
                    backgroundColor: 'var(--color-surface-hover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary-black)', display: 'block' }}>
                      {formatCurrency(c.amount)}
                    </span>
                    {c.notes && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
                        {c.notes}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
                    {formatDate(c.contribution_date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-medium-gray)', fontSize: '0.8125rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: '6px', border: '1px dashed var(--color-border)' }}>
              Nenhuma contribuição registrada ainda para esta meta.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
