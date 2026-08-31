'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Compass,
  Lightbulb,
  Sliders,
  Settings,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Movimentações', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Orçamento', href: '/budgets', icon: PieChart },
  { label: 'Metas', href: '/goals', icon: Target },
  { label: 'Estratégias', href: '/strategies', icon: Compass },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
  { label: 'Simulações', href: '/simulations', icon: Sliders },
];

const secondaryNavItems = [
  { label: 'Configurações', href: '/settings', icon: Settings },
  { label: 'Ajuda', href: '/help', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MF';

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--color-surface-white)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
      className="sidebar-desktop"
    >
      {/* Brand Header */}
      <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--color-primary-black)',
          }}
        >
          {/* Geometric Abstract 'M' Emblem */}
          <div
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: 'var(--color-primary-black)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-bg-main)',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '-0.05em',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20V4l9 9 9-9v16" />
            </svg>
          </div>
          <div>
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--color-primary-black)',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              MyFinance
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--color-medium-gray)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Planeje. Controle. Conquiste.
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '1rem 0.875rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                  backgroundColor: isActive ? 'var(--color-surface-hover)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? 'var(--color-primary-black)' : 'var(--color-medium-gray)'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary / Footer Navigation */}
      <div
        style={{
          padding: '1rem 0.875rem',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        {secondaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
                backgroundColor: isActive ? 'var(--color-surface-hover)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={17} strokeWidth={1.8} color={isActive ? 'var(--color-primary-black)' : 'var(--color-medium-gray)'} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* User Card */}
        {user ? (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 0.875rem',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-black)',
                color: 'var(--color-bg-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary-black)', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {user.email}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 0.875rem',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px dashed var(--color-border)',
              fontSize: '0.75rem',
              color: 'var(--color-medium-gray)',
              textAlign: 'center',
            }}
          >
            Sessão não iniciada
          </div>
        )}
      </div>
    </aside>
  );
}
