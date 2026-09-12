'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface ParallaxCardProps {
  number: string;
  title: string;
  description: string;
  depth: number;
  scrollYProgress: MotionValue<number>;
}

export default function ParallaxCard({
  number,
  title,
  description,
  depth,
  scrollYProgress,
}: ParallaxCardProps) {
  // Subtle parallax Y offset so cards stay in pristine alignment without overlapping
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, depth * 0.18]);

  return (
    <motion.div
      className="parallax-card-item"
      style={{ y: yOffset }}
      whileHover={{
        scale: 1.02,
        y: -6,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      <div>
        <span className="parallax-card-number">{number}</span>
        <h3 className="parallax-card-title">{title}</h3>
        <p className="parallax-card-description">{description}</p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginTop: '1rem',
        }}
      >
        <span>Explorar recurso</span>
        <span>→</span>
      </div>
    </motion.div>
  );
}
