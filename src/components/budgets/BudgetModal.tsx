'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import MoneyInput from '@/components/ui/MoneyInput';
import CategoryGridSelector from '@/components/ui/CategoryGridSelector';
import { Category } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

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
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Por favor, selecione uma categoria.');
      return;
    }
    if (!monthlyLimit || monthlyLimit <= 0) {
      setError('Por favor, defina um teto de gastos válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          monthly_limit: monthlyLimit,
          month: 8,
          year: 2026,
        }),
      });

      if (res.ok) {
        setMonthlyLimit(0);
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        setError(err.error || 'Erro ao salvar orçamento.');
      }
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Definir Teto de Orçamento"
      subtitle="Estabeleça limites por categoria para receber alertas visuais de consumo."
      maxWidth="520px"
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

        {/* Category Grid Picker */}
        <div>
          <label className="mf-label" style={{ marginBottom: '0.5rem' }}>
            Selecione a Categoria de Despesa
          </label>
          <CategoryGridSelector
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        </div>

        {/* Limit Money Input */}
        <div>
          <label className="mf-label">Limite Mensal Desejado</label>
          <MoneyInput
            value={monthlyLimit}
            onChangeValue={setMonthlyLimit}
            placeholder="0,00"
            required
            autoFocus
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', display: 'block', marginTop: '0.35rem' }}>
            O sistema alertará quando você atingir 50%, 80% e 100% deste valor.
          </span>
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
              'Definir Limite'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
