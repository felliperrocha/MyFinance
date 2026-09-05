'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import MoneyInput from '@/components/ui/MoneyInput';
import DatePickerInput from '@/components/ui/DatePickerInput';
import { GoalPriority } from '@/lib/types';
import { RefreshCw, Target, ShieldCheck, Clock } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalModal({ isOpen, onClose, onSuccess }: GoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState('2027-12-31');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Por favor, informe o nome do seu objetivo financeiro.');
      return;
    }
    if (!targetAmount || targetAmount <= 0) {
      setError('O valor alvo da meta precisa ser maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          target_amount: targetAmount,
          current_amount: currentAmount || 0,
          deadline,
          priority,
        }),
      });

      if (res.ok) {
        setTitle('');
        setTargetAmount(0);
        setCurrentAmount(0);
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao criar meta.');
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions: { id: GoalPriority; label: string; desc: string }[] = [
    { id: 'high', label: 'Alta Prioridade', desc: 'Essencial (Ex: Reserva, Dívidas)' },
    { id: 'medium', label: 'Média Prioridade', desc: 'Importante (Ex: Viagem, Carro)' },
    { id: 'low', label: 'Baixa Prioridade', desc: 'Desejo futuro de longo prazo' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Nova Meta Financeira"
      subtitle="Defina o objetivo, valor e prazo para calcularmos suas projeções."
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
          <label className="mf-label">Nome da Meta</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Ex: Reserva de Emergência 6 Meses, Imóvel Próprio, Viagem Europa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div>
            <label className="mf-label">Valor Alvo (Objetivo)</label>
            <MoneyInput
              value={targetAmount}
              onChangeValue={setTargetAmount}
              placeholder="0,00"
              required
            />
          </div>
          <div>
            <label className="mf-label">Já Acumulado (Inicial)</label>
            <MoneyInput
              value={currentAmount}
              onChangeValue={setCurrentAmount}
              placeholder="0,00"
            />
          </div>
        </div>

        <div>
          <label className="mf-label">Data Estimada para Conclusão</label>
          <DatePickerInput
            value={deadline}
            onChange={setDeadline}
            required
          />
        </div>

        {/* Priority visual selector */}
        <div>
          <label className="mf-label" style={{ marginBottom: '0.4rem' }}>
            Nível de Prioridade
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {priorityOptions.map((opt) => {
              const isSelected = priority === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.65rem 0.5rem',
                    borderRadius: '8px',
                    border: isSelected
                      ? '2px solid var(--color-primary-black)'
                      : '1px solid var(--color-border)',
                    backgroundColor: isSelected
                      ? 'var(--color-surface-hover)'
                      : 'var(--color-surface-card)',
                    color: isSelected ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary" style={{ minWidth: '130px' }}>
            {loading ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Criando...</span>
              </>
            ) : (
              'Criar Meta'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
