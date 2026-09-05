'use client';

import React from 'react';

interface MoneyInputProps {
  value: number | string;
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
  className = 'mf-input tabular-nums',
  id,
  autoFocus = false,
  required = false,
}: MoneyInputProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          position: 'absolute',
          left: '0.85rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-medium-gray)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className={className}
        style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        value={
          typeof value === 'number'
            ? value === 0
              ? ''
              : new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(value)
            : value
        }
        onChange={(e) => {
          // Remove all non-digits
          const raw = e.target.value.replace(/\D/g, '');
          if (!raw) {
            onChangeValue(0);
            return;
          }
          const num = parseInt(raw, 10) / 100;
          onChangeValue(num);
        }}
      />
    </div>
  );
}
