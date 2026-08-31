'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

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
  const [amount, setAmount] = useState('');
  const [contributionDate, setContributionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          contribution_date: contributionDate,
          notes,
        }),
      });

      if (res.ok) {
        setAmount('');
        setNotes('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error adding contribution:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Contribuição"
      subtitle={`Aportar na meta: ${goal.title}`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface-hover)',
            padding: '0.875rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-medium-gray)', display: 'block' }}>Acumulado Atual</span>
            <span style={{ fontWeight: 600, color: 'var(--color-primary-black)' }}>{formatCurrency(goal.current_amount)}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--color-medium-gray)', display: 'block' }}>Valor Alvo</span>
            <span style={{ fontWeight: 600, color: 'var(--color-primary-black)' }}>{formatCurrency(goal.target_amount)}</span>
          </div>
        </div>

        <div>
          <label className="mf-label">Valor do Aporte (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="mf-input tabular-nums"
            placeholder="Ex: 500,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mf-label">Data da Contribuição</label>
          <input
            type="date"
            className="mf-input"
            value={contributionDate}
            onChange={(e) => setContributionDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mf-label">Observações (Opcional)</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Aporte mensal, Bônus, Economia de despesas..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
            {loading ? 'Registrando...' : 'Confirmar Contribuição'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
