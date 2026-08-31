'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Category } from '@/lib/types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

export default function BudgetModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !monthlyLimit) return;

    setLoading(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          monthly_limit: parseFloat(monthlyLimit),
          month: 8,
          year: 2026,
        }),
      });

      if (res.ok) {
        setMonthlyLimit('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Definir Orçamento Mensal"
      subtitle="Estabeleça o teto de gastos para monitoramento e alertas."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label className="mf-label">Categoria de Despesa</label>
          <select
            className="mf-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mf-label">Limite Mensal de Gastos (R$)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            className="mf-input tabular-nums"
            placeholder="Ex: 1200,00"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
            {loading ? 'Salvando...' : 'Definir Limite'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
