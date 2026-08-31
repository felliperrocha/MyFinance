'use client';

import React from 'react';

interface ProgressGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  status?: 'on_track' | 'attention' | 'at_risk' | 'completed';
}

export default function ProgressGauge({
  percentage,
  size = 180,
  strokeWidth = 12,
  label,
  sublabel,
  status = 'on_track',
}: ProgressGaugeProps) {
  const safePercent = Math.min(100, Math.max(0, percentage || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  let strokeColor = 'var(--color-primary-black)';
  if (status === 'completed') strokeColor = 'var(--color-positive-text)';
  if (status === 'attention') strokeColor = 'var(--color-warning-text)';
  if (status === 'at_risk') strokeColor = 'var(--color-danger-text)';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-light-gray)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Inner Label Container */}
      <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: size * 0.2, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-primary-black)', lineHeight: 1 }}>
          {safePercent}%
        </span>
        {label && (
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-medium-gray)', marginTop: '0.25rem' }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span style={{ fontSize: '0.7rem', color: 'var(--color-medium-gray)' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
