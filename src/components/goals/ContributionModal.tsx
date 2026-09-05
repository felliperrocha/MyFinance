'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import MoneyInput from '@/components/ui/MoneyInput';
import DatePickerInput from '@/components/ui/DatePickerInput';
import { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSuccess: () => void;
}

export default function ContributionModal({
  isOpen,
  onClose,
  goal,
  onSuccess,
}: ContributionModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [contributionDate, setContributionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || amount <= 0) {
      setError('Por favor, informe um valor de aporte maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          contribution_date: contributionDate,
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        setAmount(0);
        setNotes('');
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao registrar aporte.');
      }
    } catch (err) {
      console.error('Error adding contribution:', err);
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const newTotal = (Number(goal.current_amount) || 0) + (amount || 0);
  const newPct = goal.target_amount > 0 ? Math.min(100, Math.round((newTotal / Number(goal.target_amount)) * 100)) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Novo Aporte"
      subtitle={`Adicionar valor guardado à meta: ${goal.title}`}
      maxWidth="500px"
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

        {/* Goal status highlight box */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-hover)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: 'var(--color-medium-gray)', display: 'block', fontSize: '0.75rem' }}>Acumulado Atual</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-primary-black)' }}>{formatCurrency(goal.current_amount)}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: 'var(--color-medium-gray)', display: 'block', fontSize: '0.75rem' }}>Alvo Total</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-primary-black)' }}>{formatCurrency(goal.target_amount)}</strong>
            </div>
          </div>

          {amount > 0 && (
            <div
              style={{
                borderTop: '1px dashed var(--color-border)',
                paddingTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
                color: 'var(--color-positive-text)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TrendingUp size={15} />
                <span>Após este aporte:</span>
              </div>
              <strong>{formatCurrency(newTotal)} ({newPct}%)</strong>
            </div>
          )}
        </div>

        <div>
          <label className="mf-label">Valor do Aporte</label>
          <MoneyInput
            value={amount}
            onChangeValue={setAmount}
            placeholder="0,00"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mf-label">Data da Aplicação</label>
          <DatePickerInput
            value={contributionDate}
            onChange={setContributionDate}
            required
          />
        </div>

        <div>
          <label className="mf-label">Observação ou Origem (Opcional)</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Salário mensal, Economia de compras, Rendimentos..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary" style={{ minWidth: '150px' }}>
            {loading ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Registrando...</span>
              </>
            ) : (
              'Confirmar Aporte'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
