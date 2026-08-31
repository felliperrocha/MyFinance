'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Lightbulb,
} from 'lucide-react';

const mobileNavItems = [
  { label: 'Início', href: '/', icon: LayoutDashboard },
  { label: 'Movimentos', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Orçamento', href: '/budgets', icon: PieChart },
  { label: 'Metas', href: '/goals', icon: Target },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-surface-white)',
        borderTop: '1px solid var(--color-border)',
        padding: '0.5rem 0.25rem',
        zIndex: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
      className="mobile-bottom-nav"
    >
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              textDecoration: 'none',
              color: isActive ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
              fontSize: '0.6875rem',
              fontWeight: isActive ? 600 : 500,
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
