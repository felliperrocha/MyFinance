'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Eye, ArrowRight, Quote } from 'lucide-react';

interface AboutSectionProps {
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}

export default function AboutSection({ onOpenRegister, onOpenLogin }: AboutSectionProps) {
  const pillars = [
    {
      icon: Compass,
      tag: 'PILAR 01',
      title: 'Simplicidade Radical',
      highlight: 'Menos ruído, mais foco no essencial.',
      description:
        'Eliminamos complexidades e tabelas labirínticas. O MyFinance foi desenhado para que qualquer pessoa consiga visualizar e gerir suas finanças de forma direta, sem atrito e sem planilhas intermináveis.',
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.08)',
    },
    {
      icon: ShieldCheck,
      tag: 'PILAR 02',
      title: 'Autonomia Financeira',
      highlight: 'O controle do seu futuro em suas mãos.',
      description:
        'Acreditamos que gerenciar dinheiro é sobre conquistar liberdade. Oferecemos ferramentas preditivas e metas mensuráveis para que você tome decisões estratégicas e antecipe o amanhã com total segurança.',
      color: '#6366F1',
      bgGlow: 'rgba(99, 102, 241, 0.08)',
    },
    {
      icon: Eye,
      tag: 'PILAR 03',
      title: 'Design Centrado na Experiência',
      highlight: 'Estética refinada e interatividade viva.',
      description:
        'Cuidar do seu patrimônio deve ser uma experiência prazerosa. Unimos elegância visual escura, tipografia moderna e animações a 60fps com obsessão por cada detalhe da jornada do usuário.',
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.08)',
    },
  ];

  return (
    <section
      id="sobre"
      style={{
        position: 'relative',
        padding: '7rem 2rem 8rem',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(99, 102, 241, 0.06) 45%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        
        {/* Section Editorial Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              fontSize: '0.78125rem',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={14} />
            <span>Sobre o MyFinance</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              maxWidth: '860px',
            }}
          >
            Construído para transformar a sua relação com o dinheiro.
          </h2>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#94A3B8',
              lineHeight: 1.65,
              maxWidth: '680px',
            }}
          >
            O MyFinance nasceu da convicção de que gerenciar o próprio patrimônio não deve ser um fardo de planilhas complexas ou relatórios confusos. Acreditamos que a verdadeira tranquilidade financeira surge quando cada decisão do presente é conectada a uma visão nítida do amanhã.
          </p>
        </div>

        {/* Central Mission Statement Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(16, 185, 129, 0.06) 50%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '3.5rem 3rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle top accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '240px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
            }}
          />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#10B981',
              textTransform: 'uppercase',
            }}
          >
            <Quote size={14} />
            <span>Nossa Missão</span>
          </div>

          <blockquote
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              lineHeight: 1.35,
              maxWidth: '820px',
              fontStyle: 'italic',
            }}
          >
            &ldquo;Trazer clareza, inteligência e visualização preditiva para a vida financeira das pessoas.&rdquo;
          </blockquote>

          <p style={{ fontSize: '0.9375rem', color: '#64748B', maxWidth: '580px', marginTop: '0.25rem' }}>
            Cada funcionalidade, gráfico e interação no MyFinance foi concebida para servir a esse único propósito.
          </p>
        </motion.div>

        {/* 3 Pillars Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#64748B',
                textTransform: 'uppercase',
              }}
            >
              NOSSOS VALORES E PILARES
            </span>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginTop: '0.35rem',
              }}
            >
              Os princípios que guiam o MyFinance
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5% 0px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '2.25rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: pillar.bgGlow,
                        border: `1px solid ${pillar.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pillar.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: pillar.color,
                        textTransform: 'uppercase',
                        backgroundColor: `${pillar.color}15`,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: `1px solid ${pillar.color}30`,
                      }}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: pillar.color, marginTop: '0.2rem' }}>
                      {pillar.highlight}
                    </p>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Conversion Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle top accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '260px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
            }}
          />

          <span
            style={{
              fontSize: '0.78125rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#10B981',
              textTransform: 'uppercase',
            }}
          >
            PRONTO PARA COMEÇAR?
          </span>

          <h3
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              maxWidth: '700px',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Transforme sua vida financeira hoje mesmo.
          </h3>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 1.2vw, 1.05rem)',
              color: '#94A3B8',
              maxWidth: '560px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Crie sua conta gratuitamente e experimente uma nova forma de planejar, controlar e projetar suas conquistas.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="btn-pill-white"
                style={{ padding: '0.85rem 2.25rem', fontSize: '0.9375rem' }}
              >
                <span>Criar minha conta gratuita</span>
                <ArrowRight size={17} />
              </button>
            )}
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="btn-pill-dark"
                style={{ padding: '0.85rem 1.85rem', fontSize: '0.9375rem' }}
              >
                <span>Entrar</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
