'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import BudgetModal from '@/components/budgets/BudgetModal';
import { Budget, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BudgetsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [bRes, cRes] = await Promise.all([
        fetch('/api/budgets?month=8&year=2026'),
        fetch('/api/categories'),
      ]);
      const bData = await bRes.json();
      const cData = await cRes.json();
      setBudgets(bData || []);
      setCategories(cData || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const totalLimit = budgets.reduce((acc, cur) => acc + Number(cur.monthly_limit), 0);
  const totalSpent = budgets.reduce((acc, cur) => acc + Number(cur.spent_amount || 0), 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  // Find alerts (50%, 80%, 100%)
  const exceededBudgets = budgets.filter((b) => (b.percentage_used || 0) >= 100);
  const warningBudgets = budgets.filter((b) => (b.percentage_used || 0) >= 80 && (b.percentage_used || 0) < 100);

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title and Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
              Gestão de Orçamento Mensal
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
              Defina tetos de gastos por categoria e receba alertas automáticos de consumo.
            </p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="mf-btn mf-btn-primary">
            <Plus size={16} />
            <span>Definir Novo Orçamento</span>
          </button>
        </div>

        {/* Total Budget Progress Card */}
        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Consumo Global do Mês de Agosto
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)', marginTop: '0.2rem' }} className="tabular-nums">
                {formatCurrency(totalSpent)} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-medium-gray)' }}>de {formatCurrency(totalLimit)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={totalPct >= 100 ? 'mf-badge mf-badge-danger' : totalPct >= 80 ? 'mf-badge mf-badge-warning' : 'mf-badge mf-badge-positive'}>
                {totalPct}% do teto utilizado
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--color-light-gray)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, totalPct)}%`,
                backgroundColor: totalPct >= 100 ? 'var(--color-danger-text)' : totalPct >= 80 ? 'var(--color-warning-text)' : 'var(--color-primary-black)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Budget Automatic Alerts Section */}
        {(exceededBudgets.length > 0 || warningBudgets.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {exceededBudgets.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)',
                  borderRadius: '8px',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--color-danger-text)',
                  fontSize: '0.8125rem',
                }}
              >
                <ShieldAlert size={18} color="var(--color-danger-text)" />
                <div style={{ flex: 1 }}>
                  <strong>Orçamento Excedido:</strong> Você ultrapassou o teto estipulado para <strong>{b.category_name}</strong> ({b.percentage_used}% utilizado: {formatCurrency(b.spent_amount || 0)} de {formatCurrency(b.monthly_limit)}).
                </div>
              </div>
            ))}

            {warningBudgets.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)',
                  borderRadius: '8px',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--color-warning-text)',
                  fontSize: '0.8125rem',
                }}
              >
                <AlertTriangle size={18} color="var(--color-warning-text)" />
                <div style={{ flex: 1 }}>
                  <strong>Alerta de Atenção (80%+):</strong> Você já consumiu {b.percentage_used}% do orçamento em <strong>{b.category_name}</strong>. Restam {formatCurrency(Math.max(0, b.monthly_limit - (b.spent_amount || 0)))}.
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Budget Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {budgets.map((b) => {
            const spent = Number(b.spent_amount || 0);
            const limit = Number(b.monthly_limit);
            const pct = b.percentage_used || 0;
            const remaining = Math.max(0, limit - spent);

            let statusBadge = <span className="mf-badge mf-badge-positive">Normal (&lt;50%)</span>;
            let barColor = 'var(--color-primary-black)';
            if (pct >= 100) {
              statusBadge = <span className="mf-badge mf-badge-danger">Excedido (100%+)</span>;
              barColor = 'var(--color-danger-text)';
            } else if (pct >= 80) {
              statusBadge = <span className="mf-badge mf-badge-warning">Alerta (80%+)</span>;
              barColor = 'var(--color-warning-text)';
            } else if (pct >= 50) {
              statusBadge = <span className="mf-badge mf-badge-neutral">Atenção (50%+)</span>;
            }

            return (
              <div key={b.id} className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                    {b.category_name}
                  </h3>
                  {statusBadge}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--color-medium-gray)' }}>Gasto: <strong style={{ color: 'var(--color-primary-black)' }}>{formatCurrency(spent)}</strong></span>
                    <span style={{ color: 'var(--color-medium-gray)' }}>Limite: <strong>{formatCurrency(limit)}</strong></span>
                  </div>

                  <div style={{ height: '7px', width: '100%', backgroundColor: 'var(--color-light-gray)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: barColor,
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-medium-gray)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.65rem' }}>
                  <span>{pct >= 100 ? 'Estourado em:' : 'Disponível ainda:'}</span>
                  <strong style={{ color: pct >= 100 ? 'var(--color-danger-text)' : 'var(--color-primary-black)' }}>
                    {pct >= 100 ? formatCurrency(spent - limit) : formatCurrency(remaining)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSuccess={fetchBudgets}
      />
    </>
  );
}
