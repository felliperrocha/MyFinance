'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Goal, StrategyType } from '@/lib/types';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onSuccess: () => void;
}

export default function StrategyModal({
  isOpen,
  onClose,
  goals,
  onSuccess,
}: StrategyModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strategyType, setStrategyType] = useState<StrategyType>('savings');
  const [goalId, setGoalId] = useState(goals[0]?.id || '');
  const [monthlyImpact, setMonthlyImpact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          strategy_type: strategyType,
          goal_id: goalId || null,
          estimated_monthly_impact: parseFloat(monthlyImpact) || 0,
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setMonthlyImpact('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error saving strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Estratégia Financeira"
      subtitle="Crie planos práticos para acelerar suas metas e otimizar seu patrimônio."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label className="mf-label">Título da Estratégia</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Reduzir assinaturas de streaming, Aporte automático..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="mf-label">Tipo de Estratégia</label>
            <select
              className="mf-select"
              value={strategyType}
              onChange={(e) => setStrategyType(e.target.value as StrategyType)}
            >
              <option value="savings">Economia (Redução de Gastos)</option>
              <option value="organization">Organização (Planejamento & Hábitos)</option>
              <option value="investment">Investimento (Alocação & Rendimento)</option>
            </select>
          </div>

          <div>
            <label className="mf-label">Meta Vinculada (Opcional)</label>
            <select
              className="mf-select"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              <option value="">Nenhuma meta específica</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mf-label">Impacto Mensal Estimado (R$/mês)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="mf-input tabular-nums"
            placeholder="Ex: 250,00"
            value={monthlyImpact}
            onChange={(e) => setMonthlyImpact(e.target.value)}
          />
        </div>

        <div>
          <label className="mf-label">Descrição & Plano de Ação</label>
          <textarea
            className="mf-textarea"
            rows={3}
            placeholder="Como você colocará essa estratégia em prática..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
            {loading ? 'Salvando...' : 'Criar Estratégia'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
