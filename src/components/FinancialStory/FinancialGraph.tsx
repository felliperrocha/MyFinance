'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface FinancialGraphProps {
  progress: MotionValue<number>;
}

export default function FinancialGraph({ progress }: FinancialGraphProps) {
  // Graph visual transforms driven by continuous scroll progress
  const graphScale = useTransform(progress, [0, 0.5, 1], [0.95, 1, 1.05]);
  const pathLength1 = useTransform(progress, [0, 0.45], [0.15, 1]);
  const pathLength2 = useTransform(progress, [0.45, 0.9], [0, 1]);
  const fillOpacity = useTransform(progress, [0, 0.4, 1], [0.1, 0.2, 0.3]);

  // Dynamic floating label positions & opacities
  const label1Opacity = useTransform(progress, [0, 0.3], [1, 0]);
  const label2Opacity = useTransform(progress, [0.25, 0.55], [0, 1]);
  const label2OpacityEnd = useTransform(progress, [0.55, 0.7], [1, 0]);
  const label3Opacity = useTransform(progress, [0.65, 1], [0, 1]);

  return (
    <motion.div
      style={{
        width: '100%',
        height: '420px',
        position: 'relative',
        scale: graphScale,
        background: 'rgba(15, 20, 32, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        padding: '1.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Floating Label 1: Saldo */}
      <motion.div
        className="story-floating-label"
        style={{
          top: '20%',
          left: '12%',
          opacity: label1Opacity,
        }}
      >
        <span style={{ color: '#10B981' }}>▲ +18,4%</span>
        <span>Patrimônio Acumulado</span>
      </motion.div>

      {/* Floating Label 2: Meta */}
      <motion.div
        className="story-floating-label"
        style={{
          top: '32%',
          left: '42%',
          opacity: useTransform(progress, [0.25, 0.4, 0.6, 0.7], [0, 1, 1, 0]),
        }}
      >
        <span style={{ color: '#38BDF8' }}>🎯 72%</span>
        <span>Meta Alcançada</span>
      </motion.div>

      {/* Floating Label 3: Projeção */}
      <motion.div
        className="story-floating-label"
        style={{
          top: '15%',
          right: '10%',
          opacity: label3Opacity,
        }}
      >
        <span style={{ color: '#6366F1' }}>🚀 R$ 48.200</span>
        <span>Projeção Futura</span>
      </motion.div>

      {/* Main SVG Graph */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 700 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="projectedAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Background Grid Lines */}
        <line x1="0" y1="70" x2="700" y2="70" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="6 6" />
        <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="6 6" />
        <line x1="0" y1="250" x2="700" y2="250" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="6 6" />
        <line x1="0" y1="340" x2="700" y2="340" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="6 6" />

        {/* Vertical Grid Lines */}
        <line x1="140" y1="0" x2="140" y2="360" stroke="rgba(255, 255, 255, 0.04)" />
        <line x1="280" y1="0" x2="280" y2="360" stroke="rgba(255, 255, 255, 0.04)" />
        <line x1="420" y1="0" x2="420" y2="360" stroke="rgba(255, 255, 255, 0.04)" />
        <line x1="560" y1="0" x2="560" y2="360" stroke="rgba(255, 255, 255, 0.04)" />

        {/* Main Solid Curve Path (Historical Growth) */}
        <motion.path
          d="M 0 300 Q 140 280, 240 190 T 420 150"
          fill="none"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: pathLength1 }}
        />

        {/* Main Curve Area Fill */}
        <motion.path
          d="M 0 300 Q 140 280, 240 190 T 420 150 L 420 360 L 0 360 Z"
          fill="url(#primaryAreaGrad)"
          style={{ opacity: fillOpacity }}
        />

        {/* Projected Extension Curve Path (Future Projection) */}
        <motion.path
          d="M 420 150 Q 520 100, 620 60 T 700 30"
          fill="none"
          stroke="#6366F1"
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeLinecap="round"
          style={{ pathLength: pathLength2 }}
        />

        {/* Projected Area Fill */}
        <motion.path
          d="M 420 150 Q 520 100, 620 60 T 700 30 L 700 360 L 420 360 Z"
          fill="url(#projectedAreaGrad)"
          style={{ opacity: fillOpacity }}
        />

        {/* Glowing Data Point Markers */}
        <circle cx="240" cy="190" r="6" fill="#10B981" />
        <circle cx="420" cy="150" r="7" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
        <circle cx="700" cy="30" r="7" fill="#6366F1" />
      </svg>
    </motion.div>
  );
}
