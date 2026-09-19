'use client';

import React from 'react';
import { DollarSign, X } from 'lucide-react';

interface MoneyInputProps {
  value: number;
  onChangeValue: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  autoFocus?: boolean;
  required?: boolean;
}

export default function MoneyInput({
  value,
  onChangeValue,
  placeholder = '0,00',
  id,
  autoFocus = false,
  required = false,
}: MoneyInputProps) {
  const presets = [10, 50, 100, 500];

  const formattedDisplay = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      onChangeValue(0);
      return;
    }
    const num = parseInt(raw, 10) / 100;
    onChangeValue(num);
  };

  const addPreset = (amountToAdd: number) => {
    onChangeValue((value || 0) + amountToAdd);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: '10px',
          border: value > 0 ? '2px solid var(--color-primary-black)' : '1px solid var(--color-border)',
          transition: 'all 0.2s ease',
          padding: '0.25rem 0.5rem',
        }}
      >
        <div
          style={{
            padding: '0.4rem 0.6rem',
            backgroundColor: 'var(--color-surface-card)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--color-primary-black)',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <DollarSign size={16} />
          <span>R$</span>
        </div>

        <input
          id={id}
          type="text"
          inputMode="decimal"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '0.6rem 0.75rem',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--color-primary-black)',
            fontFamily: 'inherit',
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          required={required}
          value={value === 0 ? '' : formattedDisplay}
          onChange={handleInputChange}
        />

        {value > 0 && (
          <button
            type="button"
            onClick={() => onChangeValue(0)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-medium-gray)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Limpar valor"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Value Presets */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', alignSelf: 'center', marginRight: '0.2rem' }}>
          Atalhos rápidos:
        </span>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => addPreset(preset)}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-card)',
              color: 'var(--color-primary-black)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--color-primary-black)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-card)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            + R$ {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
