'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, PlusCircle, ArrowDownCircle, Target, Sparkles, BookOpen } from 'lucide-react';

interface QuickStartGuideProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddGoal: () => void;
}

export default function QuickStartGuide({ onAddIncome, onAddExpense, onAddGoal }: QuickStartGuideProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="mf-card"
      style={{
        padding: '1.25rem',
        borderLeft: '4px solid var(--color-primary-black)',
        backgroundColor: 'var(--color-surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="var(--color-primary-black)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
            Guia Prático: Como organizar suas finanças em 3 passos
          </h3>
          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '12px', backgroundColor: 'var(--color-surface-hover)', fontWeight: 600 }}>
            Iniciante
          </span>
        </div>

        <button
          type="button"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-medium-gray)' }}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem', marginTop: '0.25rem' }}>
          {/* Step 1 */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-hover)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-positive-text)', backgroundColor: 'var(--color-positive-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Passo 1
                </span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-black)' }}>Cadastre suas Receitas</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', lineHeight: 1.35 }}>
                Registre seu salário, renda extra ou rendimentos fixos para sabermos quanto dinheiro entra todo mês.
              </p>
            </div>
            <button
              onClick={onAddIncome}
              className="mf-btn mf-btn-secondary mf-btn-sm"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <PlusCircle size={13} />
              <span>Lançar Receita</span>
            </button>
          </div>

          {/* Step 2 */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-hover)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger-text)', backgroundColor: 'var(--color-danger-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Passo 2
                </span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-black)' }}>Anote suas Despesas</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', lineHeight: 1.35 }}>
                Cadastre saídas como contas fixas, compras e mercado com a categoria correta para ter controle total.
              </p>
            </div>
            <button
              onClick={onAddExpense}
              className="mf-btn mf-btn-primary mf-btn-sm"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <ArrowDownCircle size={13} />
              <span>Lançar Despesa</span>
            </button>
          </div>

          {/* Step 3 */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-hover)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-black)', backgroundColor: 'var(--color-surface-card)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  Passo 3
                </span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-black)' }}>Crie Metas Financeiras</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', lineHeight: 1.35 }}>
                Defina um objetivo (Reserva de emergência, viagem, carro) e acompanhe seu progresso mês a mês.
              </p>
            </div>
            <button
              onClick={onAddGoal}
              className="mf-btn mf-btn-secondary mf-btn-sm"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <Target size={13} />
              <span>Criar Meta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
