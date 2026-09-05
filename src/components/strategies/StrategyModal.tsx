'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import MoneyInput from '@/components/ui/MoneyInput';
import { Goal, StrategyType } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

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
  const [monthlyImpact, setMonthlyImpact] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Por favor, defina um título para a estratégia.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          strategy_type: strategyType,
          goal_id: goalId || null,
          estimated_monthly_impact: monthlyImpact || 0,
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setMonthlyImpact(0);
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao salvar estratégia.');
      }
    } catch (err) {
      console.error('Error saving strategy:', err);
      setError('Falha de conexão com o servidor.');
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
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger-text)',
              border: '1px solid var(--color-danger-border)',
              padding: '0.6rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label className="mf-label">Título da Estratégia</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Cancelar streamings sem uso, Marmita no trabalho, Investir em Tesouro..."
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
              <option value="organization">Organização & Hábitos</option>
              <option value="investment">Investimentos & Rendimentos</option>
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
          <label className="mf-label">Impacto Mensal Estimado</label>
          <MoneyInput
            value={monthlyImpact}
            onChangeValue={setMonthlyImpact}
            placeholder="0,00"
          />
        </div>

        <div>
          <label className="mf-label">Descrição & Plano de Ação (Opcional)</label>
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
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary" style={{ minWidth: '130px' }}>
            {loading ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Salvando...</span>
              </>
            ) : (
              'Criar Estratégia'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
