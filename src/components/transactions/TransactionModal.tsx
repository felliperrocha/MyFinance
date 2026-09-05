'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import MoneyInput from '@/components/ui/MoneyInput';
import DatePickerInput from '@/components/ui/DatePickerInput';
import CategoryGridSelector from '@/components/ui/CategoryGridSelector';
import { Category, IncomeType, PaymentMethod, RecurrenceType } from '@/lib/types';
import {
  CreditCard,
  Banknote,
  Smartphone,
  Briefcase,
  Gift,
  HelpCircle,
  TrendingUp,
  ArrowDownCircle,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

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
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [incomeType, setIncomeType] = useState<IncomeType>('salary');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('monthly');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setTransactionType(defaultType);
    setErrorMessage(null);
  }, [defaultType, isOpen]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!description.trim()) {
      setErrorMessage('Por favor, informe a descrição da movimentação.');
      return;
    }
    if (!amount || amount <= 0) {
      setErrorMessage('Por favor, insira um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_type: transactionType,
          description: description.trim(),
          amount: amount,
          date,
          category_id: categoryId,
          income_type: incomeType,
          payment_method: paymentMethod,
          recurrence,
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        setDescription('');
        setAmount(0);
        setNotes('');
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Erro ao registrar movimentação.');
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      setErrorMessage('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodsList: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'credit', label: 'Cartão Crédito', icon: CreditCard },
    { id: 'debit', label: 'Cartão Débito', icon: CreditCard },
    { id: 'transfer', label: 'PIX / Transf.', icon: Smartphone },
    { id: 'cash', label: 'Dinheiro', icon: Banknote },
    { id: 'other', label: 'Outro', icon: HelpCircle },
  ];

  const incomeTypesList: { id: IncomeType; label: string; icon: any }[] = [
    { id: 'salary', label: 'Salário Fixo', icon: Briefcase },
    { id: 'extra', label: 'Renda Extra', icon: TrendingUp },
    { id: 'benefit', label: 'Rendimentos', icon: Gift },
    { id: 'other', label: 'Outro', icon: HelpCircle },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa'}
      subtitle={
        transactionType === 'income'
          ? 'Registre entradas de dinheiro para atualizar seu saldo e relatórios.'
          : 'Registre suas saídas para monitorar o orçamento e evitar surpresas.'
      }
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Toggle Type Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setTransactionType('expense');
              setErrorMessage(null);
            }}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: transactionType === 'expense' ? 'var(--color-surface-card)' : 'transparent',
              color: transactionType === 'expense' ? 'var(--color-danger-text)' : 'var(--color-medium-gray)',
              boxShadow: transactionType === 'expense' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowDownCircle size={17} />
            <span>Despesa</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTransactionType('income');
              setErrorMessage(null);
            }}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: transactionType === 'income' ? 'var(--color-surface-card)' : 'transparent',
              color: transactionType === 'income' ? 'var(--color-positive-text)' : 'var(--color-medium-gray)',
              boxShadow: transactionType === 'income' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <PlusCircle size={17} />
            <span>Receita</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
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
            {errorMessage}
          </div>
        )}

        {/* Value Input formatted automatically */}
        <div>
          <label className="mf-label">Valor</label>
          <MoneyInput
            value={amount}
            onChangeValue={setAmount}
            placeholder="0,00"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mf-label">Descrição</label>
          <input
            type="text"
            className="mf-input"
            placeholder={
              transactionType === 'income'
                ? 'Ex: Salário Empresa, Consultoria Freelance, Venda...'
                : 'Ex: Supermercado Semanal, Aluguel do Mês, Gasolina...'
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Date & Recurrence */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="mf-label">Data do Registro</label>
            <DatePickerInput
              value={date}
              onChange={setDate}
              required
            />
          </div>
          <div>
            <label className="mf-label">Recorrência</label>
            <select
              className="mf-select"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
            >
              <option value="one-time">Única (Eventual)</option>
              <option value="monthly">Mensal (Recorrente / Fixa)</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>
        </div>

        {/* Category Grid or Income Type selector */}
        {transactionType === 'expense' ? (
          <div>
            <label className="mf-label" style={{ marginBottom: '0.5rem' }}>
              Selecionar Categoria
            </label>
            <CategoryGridSelector
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </div>
        ) : (
          <div>
            <label className="mf-label" style={{ marginBottom: '0.5rem' }}>
              Tipo de Receita
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
              {incomeTypesList.map((t) => {
                const isSelected = incomeType === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setIncomeType(t.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
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
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Method (for expense) */}
        {transactionType === 'expense' && (
          <div>
            <label className="mf-label" style={{ marginBottom: '0.5rem' }}>
              Forma de Pagamento
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              {paymentMethodsList.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 0.45rem',
                      borderRadius: '8px',
                      border: isSelected
                        ? '2px solid var(--color-primary-black)'
                        : '1px solid var(--color-border)',
                      backgroundColor: isSelected
                        ? 'var(--color-surface-hover)'
                        : 'var(--color-surface-card)',
                      color: isSelected ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    <Icon size={14} />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes (Optional) */}
        <div>
          <label className="mf-label">Observações (Opcional)</label>
          <input
            type="text"
            className="mf-input"
            placeholder="Detalhes adicionais ou anotações..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="mf-btn mf-btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="mf-btn mf-btn-primary"
            style={{ minWidth: '140px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Salvando...</span>
              </>
            ) : transactionType === 'income' ? (
              'Salvar Receita'
            ) : (
              'Salvar Despesa'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
