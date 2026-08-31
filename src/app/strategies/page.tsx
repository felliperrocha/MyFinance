'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import StrategyModal from '@/components/strategies/StrategyModal';
import { Strategy, Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { Plus, CheckCircle2, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function StrategiesPage() {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'savings' | 'organization' | 'investment'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, gRes] = await Promise.all([
        fetch('/api/strategies'),
        fetch('/api/goals'),
      ]);
      const sData = await sRes.json();
      const gData = await gRes.json();
      setStrategies(sData || []);
      setGoals(gData || []);
    } catch (err) {
      console.error('Error fetching strategies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/strategies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating strategy status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta estratégia?')) return;
    try {
      const res = await fetch(`/api/strategies?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting strategy:', err);
    }
  };

  const filteredStrategies = strategies.filter((s) => {
    if (activeTab === 'all') return true;
    return s.strategy_type === activeTab;
  });

  const totalMonthlyImpact = strategies
    .filter((s) => s.status === 'active')
    .reduce((acc, cur) => acc + Number(cur.estimated_monthly_impact || 0), 0);

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title and Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
              Estratégias Financeiras
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
              Planos táticos de economia, organização e investimentos vinculados às suas metas.
            </p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="mf-btn mf-btn-primary">
            <Plus size={16} />
            <span>Nova Estratégia</span>
          </button>
        </div>

        {/* Impact Highlight Card */}
        <div
          className="mf-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-primary-black)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Impacto Mensal Total das Estratégias Ativas
            </span>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--color-positive-text)' }} className="tabular-nums">
              + {formatCurrency(totalMonthlyImpact)} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-medium-gray)' }}>/mês acelerando suas metas</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span className="mf-badge mf-badge-positive">
              {strategies.filter((s) => s.status === 'active').length} Ativas
            </span>
            <span className="mf-badge mf-badge-neutral">
              {strategies.filter((s) => s.status === 'completed').length} Concluídas
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.75rem',
            overflowX: 'auto',
          }}
        >
          {[
            { key: 'all', label: 'Todas as Estratégias' },
            { key: 'savings', label: 'Economia (Redução de Gastos)' },
            { key: 'organization', label: 'Organização & Hábitos' },
            { key: 'investment', label: 'Investimentos & Alocação' },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                  backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'transparent',
                  border: isSelected ? '1px solid var(--color-border)' : '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Strategies Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredStrategies.map((strat) => {
            const typeLabels: Record<string, string> = {
              savings: 'Economia',
              organization: 'Organização',
              investment: 'Investimento',
            };

            return (
              <div
                key={strat.id}
                className="mf-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  opacity: strat.status === 'paused' ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: 'var(--color-medium-gray)',
                      }}
                    >
                      {typeLabels[strat.strategy_type] || strat.strategy_type}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)', marginTop: '0.15rem' }}>
                      {strat.title}
                    </h3>
                  </div>

                  <span
                    className={
                      strat.status === 'active'
                        ? 'mf-badge mf-badge-positive'
                        : strat.status === 'completed'
                        ? 'mf-badge mf-badge-neutral'
                        : 'mf-badge mf-badge-warning'
                    }
                  >
                    {strat.status === 'active' ? 'Ativa' : strat.status === 'completed' ? 'Concluída' : 'Pausada'}
                  </span>
                </div>

                {strat.goal_title && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', backgroundColor: 'var(--color-surface-hover)', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    Vinculada à Meta: <strong style={{ color: 'var(--color-primary-black)' }}>{strat.goal_title}</strong>
                  </div>
                )}

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
                  {strat.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '0.75rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', display: 'block' }}>Impacto Estimado</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-positive-text)' }} className="tabular-nums">
                      + {formatCurrency(strat.estimated_monthly_impact)}/mês
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {strat.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(strat.id, 'paused')}
                        className="mf-btn mf-btn-secondary mf-btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        title="Pausar estratégia"
                      >
                        <PauseCircle size={14} />
                        <span>Pausar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(strat.id, 'active')}
                        className="mf-btn mf-btn-secondary mf-btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        title="Ativar estratégia"
                      >
                        <PlayCircle size={14} />
                        <span>Ativar</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusChange(strat.id, 'completed')}
                      className="mf-btn mf-btn-secondary mf-btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      title="Marcar como concluída"
                    >
                      <CheckCircle2 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(strat.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-medium-gray)', cursor: 'pointer', padding: '4px' }}
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <StrategyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goals={goals}
        onSuccess={fetchData}
      />
    </>
  );
}
