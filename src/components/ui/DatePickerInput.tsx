'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface DatePickerInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  required?: boolean;
}

export default function DatePickerInput({
  value,
  onChange,
  id,
  required = false,
}: DatePickerInputProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const getFirstOfMonthStr = () => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  };

  const formatFriendlyDate = (isoStr: string) => {
    if (!isoStr) return 'Selecionar data';
    if (isoStr === todayStr) return 'Hoje';
    if (isoStr === getYesterdayStr()) return 'Ontem';

    const [y, m, d] = isoStr.split('-').map(Number);
    if (!y || !m || !d) return isoStr;

    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          padding: '0.3rem 0.6rem',
        }}
      >
        <div style={{ color: 'var(--color-medium-gray)', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <CalendarIcon size={16} />
        </div>

        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-primary-black)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Date Presets & Friendly Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-medium-gray)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={11} />
          {formatFriendlyDate(value)}
        </span>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onChange(todayStr)}
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: value === todayStr ? '1px solid var(--color-primary-black)' : '1px solid var(--color-border)',
              backgroundColor: value === todayStr ? 'var(--color-primary-black)' : 'var(--color-surface-hover)',
              color: value === todayStr ? 'var(--color-bg-main)' : 'var(--color-dark-gray)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => onChange(getYesterdayStr())}
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: value === getYesterdayStr() ? '1px solid var(--color-primary-black)' : '1px solid var(--color-border)',
              backgroundColor: value === getYesterdayStr() ? 'var(--color-primary-black)' : 'var(--color-surface-hover)',
              color: value === getYesterdayStr() ? 'var(--color-bg-main)' : 'var(--color-dark-gray)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Ontem
          </button>
          <button
            type="button"
            onClick={() => onChange(getFirstOfMonthStr())}
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: value === getFirstOfMonthStr() ? '1px solid var(--color-primary-black)' : '1px solid var(--color-border)',
              backgroundColor: value === getFirstOfMonthStr() ? 'var(--color-primary-black)' : 'var(--color-surface-hover)',
              color: value === getFirstOfMonthStr() ? 'var(--color-bg-main)' : 'var(--color-dark-gray)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            1º do Mês
          </button>
        </div>
      </div>
    </div>
  );
}
