'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Wallet, TrendingUp, Sparkles, ChevronDown, CheckCircle2, BarChart3, Target } from 'lucide-react';
import FinancialStory from '../FinancialStory/FinancialStory';
import VideoScrollStory from './VideoScrollStory';
import AboutSection from './AboutSection';
import LandingFooter from './LandingFooter';

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

  const heroTrackRef = useRef<HTMLDivElement>(null);

  // Measure viewport size for accurate GPU pixel morphing
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll inside the 240vh hero container
  const { scrollYProgress } = useScroll({
    target: heroTrackRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring physics for silky 60fps tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005,
  });

  // Card Transforms: smoothly morphs from initial card (1120px x 460px, rounded 24px)
  // to full viewport (100vw x 100vh, rounded 0px)
  const cardWidth = useTransform(smoothProgress, (p) => {
    const initial = Math.min(1120, dimensions.width * 0.90);
    const target = dimensions.width;
    if (p <= 0.05) return `${Math.round(initial)}px`;
    if (p >= 0.70) return `${Math.round(target)}px`;
    const t = (p - 0.05) / (0.70 - 0.05);
    return `${Math.round(initial + (target - initial) * t)}px`;
  });

  const cardHeight = useTransform(smoothProgress, (p) => {
    const initial = Math.min(460, Math.max(380, dimensions.height * 0.58));
    const target = dimensions.height;
    if (p <= 0.05) return `${Math.round(initial)}px`;
    if (p >= 0.70) return `${Math.round(target)}px`;
    const t = (p - 0.05) / (0.70 - 0.05);
    return `${Math.round(initial + (target - initial) * t)}px`;
  });

  const cardRadius = useTransform(smoothProgress, (p) => {
    if (p <= 0.05) return '24px';
    if (p >= 0.70) return '0px';
    const t = (p - 0.05) / (0.70 - 0.05);
    return `${Math.round(24 * (1 - t))}px`;
  });

  // Card inner top padding: 2.25rem in initial card state,
  // expanding to 6.5rem (104px) in fullscreen so "VISÃO CONSOLIDADA EM TEMPO REAL" is NEVER cut off by the 70px header!
  const cardInnerPaddingTop = useTransform(smoothProgress, (p) => {
    if (p <= 0.05) return '2.25rem';
    if (p >= 0.70) return '6.5rem';
    const t = (p - 0.05) / (0.70 - 0.05);
    return `${(2.25 + (6.5 - 2.25) * t).toFixed(2)}rem`;
  });

  const cardBorderColor = useTransform(smoothProgress, (p) => {
    if (p <= 0.05) return 'rgba(255, 255, 255, 0.1)';
    if (p >= 0.70) return 'rgba(255, 255, 255, 0)';
    const t = (p - 0.05) / (0.70 - 0.05);
    const alpha = 0.1 * (1 - t);
    return `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
  });

  const cardShadow = useTransform(smoothProgress, (p) => {
    if (p <= 0.05) return '0px 25px 60px rgba(0, 0, 0, 0.8)';
    if (p >= 0.70) return '0px 0px 0px rgba(0, 0, 0, 0)';
    const t = (p - 0.05) / (0.70 - 0.05);
    const alpha = 0.8 * (1 - t);
    return `0px ${Math.round(25 * (1 - t))}px ${Math.round(60 * (1 - t))}px rgba(0, 0, 0, ${alpha.toFixed(3)})`;
  });

  const imageScale = useTransform(smoothProgress, (p) => {
    if (p <= 0.05) return 1.0;
    if (p >= 0.70) return 1.08;
    const t = (p - 0.05) / (0.70 - 0.05);
    return Number((1.0 + 0.08 * t).toFixed(3));
  });

  return (
    <div className="public-landing-container" style={{ width: '100%', overflowX: 'clip' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION — HIGH END FINTECH HEADLINE (Exact Match Image 2)
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
          padding: '4.5rem 2rem 3.5rem',
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '750px',
            height: '460px',
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

        {/* Main Headline — Exact match to User Image 2 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(1.9rem, 5.5vw, 3.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            maxWidth: '920px',
            color: '#FFFFFF',
            margin: 0,
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
            margin: 0,
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

        {/* Scroll Cue */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            const el = document.getElementById('cockpit-morph');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748B', letterSpacing: '0.04em' }}>Role para explorar a experiência</span>
          <ChevronDown size={18} color="#94A3B8" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE FULLSCREEN SCROLL MORPH COCKPIT (240vh)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="cockpit-morph"
        ref={heroTrackRef}
        style={{
          position: 'relative',
          height: '240vh',
          width: '100%',
          backgroundColor: '#07090E',
        }}
      >
        {/* Sticky Stage Viewport (100vh) */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#07090E',
          }}
        >
          {/* Subtle Ambient Glow Behind Card */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '950px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Hero Fintech Cockpit Visual — Interactive Scroll-Driven Fullscreen Morph Card */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 20,
              width: cardWidth,
              height: cardHeight,
              borderRadius: cardRadius,
              backgroundColor: '#0A0C10',
              border: '1px solid',
              borderColor: cardBorderColor,
              boxShadow: cardShadow,
              overflow: 'hidden',
              willChange: 'width, height, border-radius',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                width: '100%',
                height: '100%',
                maxWidth: '1500px',
                margin: '0 auto',
                alignItems: 'stretch',
              }}
              className="hero-reference-card-grid"
            >
              {/* Left Column: Metrics, Description and 3 Feature Pillars */}
              <motion.div
                style={{
                  paddingTop: cardInnerPaddingTop,
                  paddingBottom: 'clamp(2rem, 4vh, 4rem)',
                  paddingLeft: 'clamp(1.25rem, 4vw, 4.5rem)',
                  paddingRight: 'clamp(1.25rem, 3.5vw, 3.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* Top: Tag + Large Balance + Subtitle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'inline-block',
                        boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Visão Consolidada em Tempo Real
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 'clamp(1.85rem, 4vw, 3.75rem)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.035em',
                      lineHeight: 1.05,
                      margin: '0.1rem 0 0.25rem',
                    }}
                    className="tabular-nums"
                  >
                    R$ 24.850,00
                  </div>

                  <p
                    style={{
                      fontSize: 'clamp(0.875rem, 1.05vw, 0.975rem)',
                      color: '#94A3B8',
                      lineHeight: 1.6,
                      maxWidth: '440px',
                      margin: 0,
                    }}
                  >
                    Seus gastos, metas e investimentos em um só lugar.<br />
                    Tenha mais controle hoje para conquistar o amanhã.
                  </p>
                </div>

                {/* Bottom: 3 Features Badges with Dividers */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Feature 1 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BarChart3 size={20} color="#FFFFFF" strokeWidth={2} />
                    <div style={{ fontSize: '0.8125rem', lineHeight: 1.25, color: '#CBD5E1', fontWeight: 500 }}>
                      Acompanhe<br />seus gastos
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="cockpit-divider" style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

                  {/* Feature 2 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Target size={20} color="#FFFFFF" strokeWidth={2} />
                    <div style={{ fontSize: '0.8125rem', lineHeight: 1.25, color: '#CBD5E1', fontWeight: 500 }}>
                      Alcance<br />suas metas
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="cockpit-divider" style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

                  {/* Feature 3 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp size={20} color="#FFFFFF" strokeWidth={2} />
                    <div style={{ fontSize: '0.8125rem', lineHeight: 1.25, color: '#CBD5E1', fontWeight: 500 }}>
                      Construa<br />seu futuro
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: High-End Phone Mockup with Native HD Resolution */}
              <div
                className="hero-mockup-column"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minHeight: '340px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.img
                  src="/images/hero-mockup-mobile-hd.png"
                  alt="MyFinance App Mobile Mockup"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 30%',
                    scale: imageScale,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            </div>
          </motion.div>
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

      {/* ─────────────────────────────────────────────────────────────
          INSTITUTIONAL "SOBRE" SECTION
          ───────────────────────────────────────────────────────────── */}
      <AboutSection onOpenRegister={onOpenRegister} onOpenLogin={onOpenLogin} />

      {/* ─────────────────────────────────────────────────────────────
          LANDING FOOTER
          ───────────────────────────────────────────────────────────── */}
      <LandingFooter onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />

    </div>
  );
}
