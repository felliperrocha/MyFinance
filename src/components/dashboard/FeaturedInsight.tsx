'use client';

import React from 'react';
import Link from 'next/link';
import { Insight } from '@/lib/types';
import { Lightbulb, ArrowRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FeaturedInsightProps {
  insight: Insight | null;
}

export default function FeaturedInsight({ insight }: FeaturedInsightProps) {
  if (!insight) {
    return (
      <div
        className="mf-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-black)',
            }}
          >
            <Lightbulb size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Insights Financeiros Inteligentes
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
              Cadastre suas despesas e receitas para gerar análises determinísticas automáticas.
            </p>
          </div>
        </div>
        <Link href="/insights" className="mf-btn mf-btn-secondary mf-btn-sm" style={{ fontSize: '0.75rem' }}>
          <span>Ver análise</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  let Icon = Lightbulb;
  let badgeClass = 'mf-badge mf-badge-neutral';
  if (insight.insight_type === 'savings') {
    Icon = TrendingUp;
    badgeClass = 'mf-badge mf-badge-positive';
  } else if (insight.insight_type === 'alert') {
    Icon = AlertTriangle;
    badgeClass = 'mf-badge mf-badge-warning';
  } else if (insight.insight_type === 'goal') {
    Icon = ShieldCheck;
    badgeClass = 'mf-badge mf-badge-positive';
  }

  return (
    <div
      className="mf-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 1.5rem',
        backgroundColor: 'var(--color-surface-card)',
        border: '1px solid var(--color-border)',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
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
          <Icon size={18} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              {insight.title}
            </h4>
            <span className={badgeClass} style={{ fontSize: '0.6875rem' }}>
              {insight.insight_type === 'savings'
                ? 'Economia'
                : insight.insight_type === 'alert'
                ? 'Atenção'
                : insight.insight_type === 'goal'
                ? 'Meta'
                : 'Comportamento'}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
            {insight.content}
          </p>
        </div>
      </div>

      <Link
        href="/insights"
        className="mf-btn mf-btn-secondary mf-btn-sm"
        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', flexShrink: 0 }}
      >
        <span>Ver todos os insights</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
