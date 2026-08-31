'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Category, IncomeType, PaymentMethod, RecurrenceType } from '@/lib/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
  categories: Category[];
  onSuccess: () => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  defaultType = 'expense',
  categories,
  onSuccess,
}: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [incomeType, setIncomeType] = useState<IncomeType>('salary');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('monthly');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTransactionType(defaultType);
  }, [defaultType, isOpen]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_type: transactionType,
          description,
          amount: parseFloat(amount),
          date,
          category_id: categoryId,
          income_type: incomeType,
          payment_method: paymentMethod,
          recurrence,
          notes,
        }),
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setNotes('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionType === 'income' ? 'Registrar Receita' : 'Registrar Despesa'}
      subtitle="Preencha os dados da movimentação financeira."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Toggle Type */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => setTransactionType('expense')}
            style={{
              padding: '0.45rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: transactionType === 'expense' ? 'var(--color-surface-card)' : 'transparent',
              color: transactionType === 'expense' ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
              boxShadow: transactionType === 'expense' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('income')}
            style={{
              padding: '0.45rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: transactionType === 'income' ? 'var(--color-surface-card)' : 'transparent',
              color: transactionType === 'income' ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
              boxShadow: transactionType === 'income' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Receita
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="mf-label">Descrição</label>
          <input
            type="text"
            className="mf-input"
            placeholder={transactionType === 'income' ? 'Ex: Salário, Consultoria...' : 'Ex: Supermercado, Aluguel...'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Amount & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="mf-label">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="mf-input tabular-nums"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mf-label">Data</label>
            <input
              type="date"
              className="mf-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Conditional Category or Income Type */}
        {transactionType === 'expense' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="mf-label">Categoria</label>
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
              <label className="mf-label">Forma de Pagamento</label>
              <select
                className="mf-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="credit">Cartão de Crédito</option>
                <option value="debit">Cartão de Débito</option>
                <option value="transfer">Transferência / PIX</option>
                <option value="cash">Dinheiro</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="mf-label">Tipo de Receita</label>
            <select
              className="mf-select"
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value as IncomeType)}
            >
              <option value="salary">Salário</option>
              <option value="benefit">Benefício / Rendimentos</option>
              <option value="extra">Renda Extra / Freelance</option>
              <option value="other">Outros</option>
            </select>
          </div>
        )}

        {/* Recurrence */}
        <div>
          <label className="mf-label">Recorrência</label>
          <select
            className="mf-select"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
          >
            <option value="monthly">Mensal (Fixo / Recorrente)</option>
            <option value="one-time">Única (Eventual)</option>
            <option value="custom">Personalizada</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="mf-label">Observações (Opcional)</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Detalhes adicionais..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
            {loading ? 'Salvando...' : 'Salvar Movimentação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
