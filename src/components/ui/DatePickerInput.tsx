'use client';

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

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
  className = 'mf-input',
  id,
  required = false,
}: DatePickerInputProps) {
  // Format for friendly human display: DD/MM/AAAA
  const formatDateDisplay = (isoStr: string) => {
    if (!isoStr) return 'Selecionar data';
    const [y, m, d] = isoStr.split('-');
    if (y && m && d) {
      return `${d}/${m}/${y}`;
    }
    return isoStr;
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={className}
        style={{
          paddingRight: '2.5rem',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '0.85rem',
          pointerEvents: 'none',
          color: 'var(--color-medium-gray)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CalendarIcon size={16} />
      </div>
    </div>
  );
}
