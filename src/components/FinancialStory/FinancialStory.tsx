'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import FinancialGraph from './FinancialGraph';
import ParallaxCard from './ParallaxCard';
import './FinancialStory.css';

interface FinancialStoryProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export default function FinancialStory({ onOpenRegister, onOpenLogin }: FinancialStoryProps) {
  const storyRef = useRef<HTMLDivElement>(null);

  // Track scroll position seamlessly across the storytelling section
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  // Story Steps Data
  const steps = [
    {
      eyebrow: '01 — VISÃO',
      title: 'Entenda seu dinheiro.',
      description: 'Tenha uma visão clara da sua evolução financeira e acompanhe seu patrimônio ao longo do tempo.',
      metric: 'R$ 24.850',
      label: 'Patrimônio atual',
    },
    {
      eyebrow: '02 — CONTROLE',
      title: 'Veja para onde ele está indo.',
      description: 'Identifique padrões, acompanhe suas movimentações e descubra onde seu dinheiro está sendo utilizado.',
      metric: 'R$ 6.420',
      label: 'Gastos este mês',
    },
    {
      eyebrow: '03 — OBJETIVOS',
      title: 'Transforme dinheiro em metas.',
      description: 'Defina objetivos financeiros e acompanhe visualmente o caminho até cada conquista.',
      metric: '72%',
      label: 'Meta alcançada',
    },
    {
      eyebrow: '04 — FUTURO',
      title: 'Veja o impacto das suas decisões.',
      description: 'Simule cenários e descubra como pequenas decisões de hoje podem transformar seu futuro financeiro.',
      metric: 'R$ 48.200',
      label: 'Projeção estimada',
    },
  ];

  // Parallax feature cards data with subtle depth offsets
  const featureCards = [
    {
      number: '01',
      title: 'Movimentações',
      description: 'Tudo que entra e sai do seu dinheiro em um único lugar.',
      depth: -40,
    },
    {
      number: '02',
      title: 'Orçamento',
      description: 'Defina limites e acompanhe seu desempenho financeiro.',
      depth: 30,
    },
    {
      number: '03',
      title: 'Metas',
      description: 'Transforme seus objetivos em planos mensuráveis.',
      depth: -50,
    },
    {
      number: '04',
      title: 'Estratégias',
      description: 'Tome decisões com base na evolução das suas finanças.',
      depth: 40,
    },
    {
      number: '05',
      title: 'Insights',
      description: 'Encontre padrões e oportunidades escondidas nos seus dados.',
      depth: -30,
    },
    {
      number: '06',
      title: 'Simulações',
      description: 'Antecipe cenários antes de tomar decisões importantes.',
      depth: 50,
    },
  ];

  return (
    <div className="financial-story-container">
      
      {/* ─────────────────────────────────────────────────────────────
          PINNED GRAPH SCROLL STORYTELLING SECTION (NO BLANK GAPS)
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={storyRef}
        style={{
          position: 'relative',
          padding: '4rem 2.5rem 6rem',
          maxWidth: '1380px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '4rem',
            alignItems: 'flex-start',
          }}
        >
          
          {/* Left Column: 4 Sequential Scroll Step Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', padding: '2rem 0' }}>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0.3, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-30% 0px -30% 0px' }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <span className="story-eyebrow">{step.eyebrow}</span>
                <h2 className="story-title" style={{ fontSize: '2.5rem' }}>{step.title}</h2>
                <p className="story-description">{step.description}</p>
                <div className="story-metric-box">
                  <span className="story-metric-value">{step.metric}</span>
                  <span className="story-metric-label">{step.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Pinned Graph Following the Scroll */}
          <div style={{ position: 'sticky', top: '120px', width: '100%' }}>
            <FinancialGraph progress={smoothProgress} />
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PARALLAX FEATURE CARDS SECTION (SPEC 18 & 19)
          ───────────────────────────────────────────────────────────── */}
      <section id="recursos" className="feature-parallax-section">
        
        {/* Editorial Section Header */}
        <div className="feature-editorial-header">
          <span className="feature-editorial-eyebrow">MY FINANCE</span>
          <h2 className="feature-editorial-title">
            Seu dinheiro.<br />
            <span>Uma nova perspectiva.</span>
          </h2>
        </div>

        {/* Parallax Cards Grid */}
        <div className="parallax-cards-grid">
          {featureCards.map((card, idx) => (
            <ParallaxCard
              key={idx}
              number={card.number}
              title={card.title}
              description={card.description}
              depth={card.depth}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          FINAL CALL TO ACTION BANNER (SPEC 30)
          ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '6rem 2.5rem 8rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '4.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ fontSize: '0.78125rem', fontWeight: 700, letterSpacing: '0.1em', color: '#10B981', textTransform: 'uppercase' }}>
            PRONTO PARA COMEÇAR?
          </span>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#FFFFFF', maxWidth: '700px', lineHeight: 1.1 }}>
            Comece a transformar sua vida financeira.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '520px', lineHeight: 1.6 }}>
            Crie sua conta gratuitamente e experimente uma nova forma de interagir com seu patrimônio.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={onOpenRegister}
              className="btn-pill-white"
              style={{ padding: '0.85rem 2.25rem', fontSize: '0.9375rem' }}
            >
              Criar conta gratuita →
            </button>
            <button
              onClick={onOpenLogin}
              className="btn-pill-dark"
              style={{ padding: '0.85rem 1.85rem', fontSize: '0.9375rem' }}
            >
              Entrar
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
