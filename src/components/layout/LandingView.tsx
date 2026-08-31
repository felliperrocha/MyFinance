'use client';

import React from 'react';
import { Target, PieChart, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function LandingView({ onOpenLogin, onOpenRegister }: LandingViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '1rem 0 3rem' }}>
      {/* Hero Section */}
      <div
        className="mf-card"
        style={{
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-primary-black)',
            letterSpacing: '0.02em',
          }}
        >
          <ShieldCheck size={14} />
          <span>Plataforma Sofisticada de Planejamento Financeiro</span>
        </div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-primary-black)',
            lineHeight: 1.15,
            maxWidth: '720px',
          }}
        >
          Planeje suas metas. Controle seus gastos. Conquiste sua independência.
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-medium-gray)',
            lineHeight: 1.6,
            maxWidth: '600px',
          }}
        >
          O MyFinance foi projetado como um centro de inteligência financeira pessoal. Defina metas com acompanhamento visual, gerencie orçamentos mensais com alertas automáticos e simule cenários para acelerar suas conquistas.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onOpenRegister}
            className="mf-btn mf-btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}
          >
            <span>Criar Conta Gratuita</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onOpenLogin}
            className="mf-btn mf-btn-secondary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}
          >
            <span>Já tenho uma conta</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Pillars Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-black)',
              color: 'var(--color-bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Target size={18} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Metas com Forecast Matemático
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
            Acompanhe o percentual de evolução em gauges radiais e receba projeções dinâmicas de data de conclusão com base no seu ritmo real de aportes.
          </p>
        </div>

        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-black)',
              color: 'var(--color-bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieChart size={18} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Orçamento com Alertas
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
            Defina limites de gastos por categoria e receba avisos preventivos em 50%, 80% e notificações instantâneas ao atingir 100% do teto.
          </p>
        </div>

        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-black)',
              color: 'var(--color-bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sliders size={18} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Simulador de Cenários
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
            Calcule exatamente quantos meses você economiza ao redirecionar cortes de gastos e aplicar rendimentos compostos às suas metas.
          </p>
        </div>

        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-black)',
              color: 'var(--color-bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Persistência Neon PostgreSQL
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
            Armazenamento seguro em nuvem com isolamento total dos seus dados por usuário, senhas criptografadas com bcrypt e alta confiabilidade.
          </p>
        </div>
      </div>
    </div>
  );
}
