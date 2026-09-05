'use client';

import React from 'react';
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
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
        gap: '0.5rem',
        maxHeight: '175px',
        overflowY: 'auto',
        padding: '2px',
      }}
    >
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;
        const IconComponent = iconMap[cat.icon] || Tag;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.65rem 0.5rem',
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
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: isSelected
                  ? 'var(--color-primary-black)'
                  : 'var(--color-surface-hover)',
                color: isSelected ? 'var(--color-bg-main)' : 'var(--color-medium-gray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <IconComponent size={16} strokeWidth={isSelected ? 2.2 : 1.8} />
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: isSelected ? 600 : 500,
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
