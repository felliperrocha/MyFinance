'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, TrendingUp, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import FinancialStory from '../FinancialStory/FinancialStory';
import VideoScrollStory from './VideoScrollStory';

interface LandingViewProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function LandingView({ onOpenLogin, onOpenRegister }: LandingViewProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="public-landing-container" style={{ width: '100%', overflowX: 'clip' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION — HIGH END FINTECH COCKPIT
          ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.75rem',
          padding: '4.5rem 2rem 3rem',
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Brand Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#10B981',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <Sparkles size={14} />
          <span>My Finance — Planeje. Controle. Conquiste.</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '3.75rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            maxWidth: '900px',
            color: '#FFFFFF',
          }}
        >
          Planeje suas metas.<br />
          Controle seus gastos.<br />
          Conquiste sua independência.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '1.15rem',
            color: '#94A3B8',
            lineHeight: 1.6,
            maxWidth: '640px',
          }}
        >
          Uma experiência financeira desenhada em torno de clareza, inteligência e visualização preditiva.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onOpenRegister}
            className="btn-pill-white"
            style={{ padding: '0.85rem 2.25rem', fontSize: '0.9375rem' }}
          >
            <span>Criar minha conta gratuita</span>
            <ArrowRight size={17} />
          </button>
          <button
            onClick={onOpenLogin}
            className="btn-pill-dark"
            style={{ padding: '0.85rem 1.85rem', fontSize: '0.9375rem' }}
          >
            <span>Entrar</span>
          </button>
        </motion.div>

        {/* Hero High-End Fintech Cockpit Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '3rem',
            width: '100%',
            maxWidth: '960px',
          }}
          className="glass-card-obsidian"
        >
          <div style={{ padding: '2rem 2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            
            {/* Top Bar inside Cockpit Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Visão Consolidada em Tempo Real
                  </span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0' }} className="tabular-nums">
                  R$ 24.850,00
                </div>
              </div>

              {/* Floating Stat Chips */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.5rem 0.85rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.78125rem', color: '#34D399', fontWeight: 700 }}>
                  ▲ +18,4% acumulado
                </div>
                <div style={{ padding: '0.5rem 0.85rem', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.78125rem', color: '#FFFFFF', fontWeight: 600 }}>
                  Aporte Mensal: R$ 4.200
                </div>
              </div>
            </div>

            {/* High-Precision Sleek SVG Curve Chart */}
            <div style={{ height: '160px', width: '100%', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 700 160" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />

                {/* Fill Area */}
                <path d="M 0 130 Q 180 110, 340 70 T 700 25 L 700 160 L 0 160 Z" fill="url(#heroGradient)" />

                {/* Glowing Stroke Curve */}
                <path d="M 0 130 Q 180 110, 340 70 T 700 25" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />

                {/* Animated Glowing Node */}
                <circle cx="700" cy="25" r="6" fill="#FFFFFF" />
                <circle cx="700" cy="25" r="12" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6" />
              </svg>

              {/* Floating Tooltip Box on Peak */}
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#07090E',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.3rem 0.7rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                }}
              >
                R$ 24.850,00
              </div>
            </div>

          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            cursor: 'pointer',
          }}
          onClick={() => scrollToSection('story')}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748B', letterSpacing: '0.04em' }}>Role para vivenciar a história</span>
          <ChevronDown size={18} color="#94A3B8" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE VIDEO SCROLL SECTION (300vh sticky 60fps scrollytelling)
          ───────────────────────────────────────────────────────────── */}
      <VideoScrollStory />

      {/* ─────────────────────────────────────────────────────────────
          FINANCIAL STORY SCROLL EXPERIENCE
          ───────────────────────────────────────────────────────────── */}
      <section id="story">
        <FinancialStory onOpenRegister={onOpenRegister} onOpenLogin={onOpenLogin} />
      </section>

    </div>
  );
}
