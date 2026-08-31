'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface MetricCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  changePct?: number;
  changeLabel?: string;
  isPositiveChangeGood?: boolean;
}

export default function MetricCard({
  title,
  amount,
  icon: Icon,
  changePct,
  changeLabel = 'vs. mês anterior',
  isPositiveChangeGood = true,
}: MetricCardProps) {
  const isPositive = (changePct || 0) >= 0;
  const isGood = isPositiveChangeGood ? isPositive : !isPositive;

  return (
    <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-medium-gray)' }}>
          {title}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-black)',
          }}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '1.625rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-primary-black)',
            lineHeight: 1.1,
          }}
          className="tabular-nums"
        >
          {formatCurrency(amount)}
        </div>

        {changePct !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
            <span
              className={isGood ? 'mf-badge mf-badge-positive' : 'mf-badge mf-badge-danger'}
            >
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(changePct)}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
              {changeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
