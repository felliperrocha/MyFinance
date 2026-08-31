'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { Target, PieChart, Sliders, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '880px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
            Central de Ajuda & Guia MyFinance
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
            Aprenda a estruturar seu fluxo financeiro, gerenciar orçamentos e atingir suas metas com previsibilidade.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Metas & Forecast
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
              Ao cadastrar uma meta e registrar aportes periódicos, o MyFinance calcula matematicamente a velocidade média e projeta a data estimada de conclusão.
            </p>
            <Link href="/goals" className="mf-btn mf-btn-secondary mf-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <span>Ir para Metas</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Sistema de Orçamento
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
              Defina limites mensais para cada categoria. O sistema monitora seus gastos e emite alertas visuais automáticos nos limites de 50%, 80% e 100%+.
            </p>
            <Link href="/budgets" className="mf-btn mf-btn-secondary mf-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <span>Ir para Orçamento</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Simulações Financeiras
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', lineHeight: 1.5 }}>
              Utilize o laboratório de cenários para calcular quantos meses você economiza ao aumentar seus aportes mensais ou cortar custos supérfluos.
            </p>
            <Link href="/simulations" className="mf-btn mf-btn-secondary mf-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <span>Ir para Simulações</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Database setup box */}
        <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={18} color="var(--color-primary-black)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Conexão com Banco de Dados Neon PostgreSQL
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
            O MyFinance suporta persistência robusta na nuvem utilizando o <strong>Neon PostgreSQL</strong>.
            Basta criar uma instância gratuita no <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary-black)', fontWeight: 600, textDecoration: 'underline' }}>Neon.tech</a>, copiar a URL de conexão (DATABASE_URL) e inseri-la no arquivo <code style={{ backgroundColor: 'var(--color-light-gray)', padding: '2px 5px', borderRadius: '3px' }}>.env.local</code>.
          </p>
        </div>
      </main>
    </>
  );
}
