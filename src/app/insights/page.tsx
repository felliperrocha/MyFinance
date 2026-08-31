'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Insight } from '@/lib/types';
import { formatDate } from '@/lib/formatters';
import { Lightbulb, TrendingUp, AlertTriangle, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function InsightsPage() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'savings' | 'alert' | 'goal' | 'behavior'>('all');
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/insights');
      const data = await res.json();
      setInsights(data || []);
    } catch (err) {
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/insights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: !currentRead }),
      });
      if (res.ok) {
        fetchInsights();
      }
    } catch (err) {
      console.error('Error updating insight read status:', err);
    }
  };

  const filtered = activeFilter === 'all'
    ? insights
    : insights.filter((i) => i.insight_type === activeFilter);

  const unreadCount = insights.filter((i) => !i.is_read).length;

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title and Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
              Insights Financeiros Automáticos
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
              Análises determinísticas baseadas em cálculos matemáticos e regras do seu fluxo de caixa.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="mf-badge mf-badge-neutral" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
              {unreadCount} não lidos de {insights.length} totais
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
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
            { key: 'all', label: 'Todos os Insights' },
            { key: 'savings', label: 'Economia & Poupança' },
            { key: 'alert', label: 'Alertas de Orçamento' },
            { key: 'goal', label: 'Progresso de Metas' },
            { key: 'behavior', label: 'Comportamento de Gastos' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
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

        {/* Insights List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.length === 0 ? (
            <div className="mf-card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-medium-gray)' }}>
              Nenhum insight encontrado nesta categoria no momento.
            </div>
          ) : (
            filtered.map((ins) => {
              let Icon = Lightbulb;
              let badgeClass = 'mf-badge mf-badge-neutral';
              let badgeLabel = 'Geral';

              if (ins.insight_type === 'savings') {
                Icon = TrendingUp;
                badgeClass = 'mf-badge mf-badge-positive';
                badgeLabel = 'Economia';
              } else if (ins.insight_type === 'alert') {
                Icon = AlertTriangle;
                badgeClass = 'mf-badge mf-badge-danger';
                badgeLabel = 'Alerta';
              } else if (ins.insight_type === 'goal') {
                Icon = ShieldCheck;
                badgeClass = 'mf-badge mf-badge-positive';
                badgeLabel = 'Metas';
              } else if (ins.insight_type === 'behavior') {
                Icon = Activity;
                badgeClass = 'mf-badge mf-badge-warning';
                badgeLabel = 'Comportamento';
              }

              return (
                <div
                  key={ins.id}
                  className="mf-card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: ins.is_read ? 'var(--color-surface-hover)' : 'var(--color-surface-card)',
                    borderLeft: ins.is_read ? '1px solid var(--color-border)' : '3px solid var(--color-primary-black)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-surface-hover)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary-black)',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={badgeClass}>{badgeLabel}</span>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                          {ins.title}
                        </h3>
                        {!ins.is_read && (
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-danger-text)' }} />
                        )}
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
                        {ins.content}
                      </p>

                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
                        Calculado em {formatDate(ins.created_at)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleRead(ins.id, ins.is_read)}
                    className="mf-btn mf-btn-secondary mf-btn-sm"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', flexShrink: 0 }}
                    title={ins.is_read ? 'Marcar como não lido' : 'Marcar como lido'}
                  >
                    {ins.is_read ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{ins.is_read ? 'Não lido' : 'Lido'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
