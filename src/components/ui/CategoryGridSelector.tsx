'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import {
  Tag,
  Home,
  Utensils,
  Car,
  Activity,
  GraduationCap,
  Film,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  MoreHorizontal,
  Coffee,
  HeartPulse,
  Search,
  CheckCircle2,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Tag,
  Home,
  Utensils,
  Car,
  Activity,
  GraduationCap,
  Film,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Coffee,
  HeartPulse,
  MoreHorizontal,
};

interface CategoryGridSelectorProps {
  categories: Category[];
  selectedId: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryGridSelector({
  categories,
  selectedId,
  onSelect,
}: CategoryGridSelectorProps) {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Search Input for categories if > 6 categories */}
      {categories.length > 6 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.6rem',
            backgroundColor: 'var(--color-surface-hover)',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
          }}
        >
          <Search size={14} color="var(--color-medium-gray)" />
          <input
            type="text"
            placeholder="Filtrar categoria..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.75rem',
              color: 'var(--color-primary-black)',
              width: '100%',
            }}
          />
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '0.5rem',
          maxHeight: '180px',
          overflowY: 'auto',
          padding: '2px',
        }}
      >
        {filteredCategories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const IconComponent = iconMap[cat.icon] || Tag;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 0.65rem',
                borderRadius: '8px',
                border: isSelected
                  ? '2px solid var(--color-primary-black)'
                  : '1px solid var(--color-border)',
                backgroundColor: isSelected
                  ? 'var(--color-surface-hover)'
                  : 'var(--color-surface-card)',
                color: isSelected
                  ? 'var(--color-primary-black)'
                  : 'var(--color-dark-gray)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: isSelected
                    ? 'var(--color-primary-black)'
                    : 'var(--color-surface-hover)',
                  color: isSelected ? 'var(--color-bg-main)' : 'var(--color-medium-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <IconComponent size={14} strokeWidth={isSelected ? 2.2 : 1.8} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {cat.name}
              </span>

              {isSelected && (
                <CheckCircle2 size={13} color="var(--color-primary-black)" style={{ flexShrink: 0 }} />
              )}
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
            Nenhuma categoria com esse nome.
          </div>
        )}
      </div>
    </div>
  );
}
