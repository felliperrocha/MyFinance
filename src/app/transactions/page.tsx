'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import TransactionModal from '@/components/transactions/TransactionModal';
import AuthModal from '@/components/auth/AuthModal';
import { Category } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  PlusCircle,
  ArrowDownCircle,
  Trash2,
  Search,
  LogIn,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TransactionsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [recurrenceFilter, setRecurrenceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const [txRes, catRes] = await Promise.all([
        fetch('/api/transactions', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);
      const txData = await txRes.json();
      const catData = await catRes.json();
      setTransactions(txData.transactions || []);
      setCategories(catData || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [user, fetchTransactions]);

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Deseja realmente excluir esta movimentação?')) return;
    try {
      const res = await fetch(`/api/transactions?id=${id}&type=${type}`, { method: 'DELETE' });
      if (res.ok) {
        // Optimistic local removal
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        fetchTransactions();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setTransactions([]);
  };

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.transaction_type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (recurrenceFilter !== 'all' && t.recurrence !== recurrenceFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchDesc = t.description?.toLowerCase().includes(term);
      const matchCat = t.category_name?.toLowerCase().includes(term);
      if (!matchDesc && !matchCat) return false;
    }
    return true;
  });

  const totalIncomeFiltered = filtered
    .filter((t) => t.transaction_type === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);

  const totalExpenseFiltered = filtered
    .filter((t) => t.transaction_type === 'expense')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);

  const netBalanceFiltered = totalIncomeFiltered - totalExpenseFiltered;

  return (
    <>
      <Header
        user={user}
        onOpenLogin={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {authLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--color-medium-gray)' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-black)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              <span style={{ fontSize: '0.8125rem' }}>Carregando suas finanças...</span>
            </div>
          </div>
        ) : !user ? (
          <div className="mf-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Acesse sua conta para ver suas movimentações
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-medium-gray)', maxWidth: '480px' }}>
              Faça login ou crie uma conta gratuita para registrar suas receitas, despesas e manter seu fluxo financeiro organizado.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="mf-btn mf-btn-primary"
              >
                <LogIn size={15} />
                <span>Entrar na Conta</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="mf-btn mf-btn-secondary"
              >
                <span>Criar Conta</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Title + Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
                  Movimentações Financeiras
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
                  Controle simplificado de todas as entradas e saídas de dinheiro.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <button
                  onClick={() => fetchTransactions()}
                  className="mf-btn mf-btn-secondary mf-btn-sm"
                  title="Atualizar lista"
                >
                  <RefreshCw size={14} className={loadingData ? 'spin' : ''} />
                  <span>Atualizar</span>
                </button>
                <button
                  onClick={() => setIsIncomeModalOpen(true)}
                  className="mf-btn mf-btn-secondary"
                  style={{ color: 'var(--color-positive-text)', fontWeight: 600 }}
                >
                  <PlusCircle size={16} />
                  <span>Nova Receita</span>
                </button>
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="mf-btn mf-btn-primary"
                >
                  <ArrowDownCircle size={16} />
                  <span>Nova Despesa</span>
                </button>
              </div>
            </div>

            {/* Quick Balance Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <div className="mf-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase' }}>
                    Entradas Filtradas
                  </span>
                  <ArrowUpRight size={16} color="var(--color-positive-text)" />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-positive-text)' }} className="tabular-nums">
                  + {formatCurrency(totalIncomeFiltered)}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)' }}>
                  {filtered.filter((t) => t.transaction_type === 'income').length} lançamento(s)
                </span>
              </div>

              <div className="mf-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase' }}>
                    Saídas Filtradas
                  </span>
                  <ArrowDownRight size={16} color="var(--color-danger-text)" />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-danger-text)' }} className="tabular-nums">
                  - {formatCurrency(totalExpenseFiltered)}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)' }}>
                  {filtered.filter((t) => t.transaction_type === 'expense').length} lançamento(s)
                </span>
              </div>

              <div className="mf-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase' }}>
                    Saldo das Movimentações
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: netBalanceFiltered >= 0 ? 'var(--color-positive-text)' : 'var(--color-danger-text)',
                  }}
                  className="tabular-nums"
                >
                  {netBalanceFiltered >= 0 ? `+ ${formatCurrency(netBalanceFiltered)}` : `- ${formatCurrency(Math.abs(netBalanceFiltered))}`}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)' }}>
                  {netBalanceFiltered >= 0 ? 'Fluxo superavitário' : 'Atenção: saídas superam receitas'}
                </span>
              </div>
            </div>

            {/* Filters Bar */}
            <div
              className="mf-card"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                <Search size={16} color="var(--color-medium-gray)" />
                <input
                  type="text"
                  placeholder="Buscar por descrição ou categoria..."
                  className="mf-input"
                  style={{ padding: '0.45rem 0.75rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="mf-select"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                  <option value="all">Todas as Movimentações</option>
                  <option value="income">Apenas Receitas (+)</option>
                  <option value="expense">Apenas Despesas (-)</option>
                </select>

                <select
                  className="mf-select"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="mf-select"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
                  value={recurrenceFilter}
                  onChange={(e) => setRecurrenceFilter(e.target.value)}
                >
                  <option value="all">Todas as recorrências</option>
                  <option value="monthly">Mensal (Recorrente)</option>
                  <option value="one-time">Única (Eventual)</option>
                  <option value="custom">Personalizada</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="mf-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-table-header)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-medium-gray)' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Data</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Descrição</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Categoria</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Recorrência</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Tipo / Pagamento</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Valor</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--color-medium-gray)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={24} color="var(--color-medium-gray)" />
                            <strong>Nenhuma movimentação encontrada</strong>
                            <span style={{ fontSize: '0.75rem' }}>Clique em &quot;Nova Receita&quot; ou &quot;Nova Despesa&quot; acima para registrar.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((t) => {
                        const isIncome = t.transaction_type === 'income';
                        return (
                          <tr
                            key={t.id}
                            style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background-color 0.15s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--color-medium-gray)' }}>{formatDate(t.date)}</td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                              {t.description}
                              {t.notes && <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-medium-gray)' }}>{t.notes}</span>}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-black)' }}>
                              {t.category_name || (isIncome ? 'Receita' : 'Geral')}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--color-medium-gray)' }}>
                              {t.recurrence === 'monthly' ? 'Mensal' : t.recurrence === 'one-time' ? 'Única' : 'Personalizada'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--color-medium-gray)' }}>
                              {t.payment_method === 'credit'
                                ? 'Cartão de Crédito'
                                : t.payment_method === 'debit'
                                ? 'Cartão de Débito'
                                : t.payment_method === 'transfer'
                                ? 'PIX / Transf.'
                                : t.payment_method === 'cash'
                                ? 'Dinheiro'
                                : t.income_type === 'salary'
                                ? 'Salário'
                                : t.income_type === 'extra'
                                ? 'Renda Extra'
                                : t.income_type === 'benefit'
                                ? 'Rendimento'
                                : t.payment_method || t.income_type || '-'}
                            </td>
                            <td
                              style={{
                                padding: '0.85rem 1rem',
                                fontWeight: 700,
                                textAlign: 'right',
                                color: isIncome ? 'var(--color-positive-text)' : 'var(--color-danger-text)',
                              }}
                              className="tabular-nums"
                            >
                              {isIncome ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDelete(t.id, t.transaction_type)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--color-medium-gray)',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '4px',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger-text)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-medium-gray)')}
                                title="Excluir movimentação"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => fetchTransactions()}
      />

      <TransactionModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        defaultType="income"
        categories={categories}
        onSuccess={fetchTransactions}
      />

      <TransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        defaultType="expense"
        categories={categories}
        onSuccess={fetchTransactions}
      />
    </>
  );
}
