'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { GoalPriority } from '@/lib/types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalModal({ isOpen, onClose, onSuccess }: GoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('2027-12-31');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          target_amount: parseFloat(targetAmount),
          current_amount: parseFloat(currentAmount) || 0,
          deadline,
          priority,
        }),
      });

      if (res.ok) {
        setTitle('');
        setTargetAmount('');
        setCurrentAmount('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Meta Financeira"
      subtitle="Defina seus objetivos, prazos e prioridades de conquista."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label className="mf-label">Título da Meta</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Reserva de Emergência, Imóvel Próprio, Viagem..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="mf-label">Valor Alvo (R$)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              className="mf-input tabular-nums"
              placeholder="Ex: 20000,00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mf-label">Valor Inicial Já Acumulado (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mf-input tabular-nums"
              placeholder="0,00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="mf-label">Data Limite (Prazo)</label>
            <input
              type="date"
              className="mf-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mf-label">Prioridade</label>
            <select
              className="mf-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as GoalPriority)}
            >
              <option value="high">Alta Prioridade</option>
              <option value="medium">Média Prioridade</option>
              <option value="low">Baixa Prioridade</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
            {loading ? 'Criando...' : 'Criar Meta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
