'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface VideoScrollStoryProps {
  videoSrc?: string;
}

export default function VideoScrollStory({
  videoSrc = '/media/financial-chart-scroll.mp4',
}: VideoScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const [hasVideo, setHasVideo] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // RAF High-Precision Lerp State (60fps)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // 1. Detect and setup video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      if (video.duration && !isNaN(video.duration)) {
        setHasVideo(true);
      }
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('canplay', handleLoaded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('canplay', handleLoaded);
    };
  }, [videoSrc]);

  // 2. High-precision 60fps Scroll Synchronization Calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.clientHeight;
      const windowHeight = window.innerHeight;

      // Distance user scrolls while pinned (300vh scroll inside 400vh container)
      const totalScrollable = containerHeight - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);

      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    // 60fps Lerp Loop
    const updateLoop = () => {
      // Lerp factor 0.16 for instant ultra-smooth 60fps response
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.16;

      const p = currentProgressRef.current;
      setScrollProgress(p);

      // Seek video currentTime to scroll progress
      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration) && video.readyState >= 2) {
        const targetTime = video.duration * p;
        if (Math.abs(video.currentTime - targetTime) > 0.005) {
          video.currentTime = targetTime;
        }
      }

      // Render 60fps canvas chart & update pill position to follow curve lead node
      drawFullscreenChartWithNumbers(p);

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // 3. Render 100% Fullscreen Financial Graph & Update Pill Position
  const drawFullscreenChartWithNumbers = (p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Auto-fit screen resolution
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark Obsidian Fullscreen Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#07090E');
    bgGrad.addColorStop(0.5, '#090D15');
    bgGrad.addColorStop(1, '#050709');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ambient Center Glow
    const ambientGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      100,
      width * 0.5,
      height * 0.45,
      width * 0.45
    );
    ambientGrad.addColorStop(0, `rgba(16, 185, 129, ${0.16 * p})`);
    ambientGrad.addColorStop(0.6, `rgba(99, 102, 241, ${0.06 * p})`);
    ambientGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid Margins
    const isMobile = width < 640;
    const marginX = isMobile ? Math.max(68, width * 0.16) : width * 0.10;
    const usableWidth = width - marginX * 2;
    const startY = height * 0.78;
    const peakY = height * 0.24;
    const totalRise = startY - peakY;

    // Y-Axis Horizontal Scale Lines & Currency Labels
    const ySteps = [
      { label: 'R$ 60.000', ratio: 1.0 },
      { label: 'R$ 45.000', ratio: 0.75 },
      { label: 'R$ 30.000', ratio: 0.50 },
      { label: 'R$ 15.000', ratio: 0.25 },
      { label: 'R$ 0', ratio: 0.0 },
    ];

    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.textAlign = 'right';

    ySteps.forEach((step) => {
      const y = startY - step.ratio * totalRise;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(marginX, y);
      ctx.lineTo(width - marginX, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillText(step.label, marginX - (isMobile ? 10 : 16), y + 4);
    });

    // X-Axis Timeline Month Labels
    const xSteps = [
      { label: 'Mês 1', t: 0 },
      { label: 'Mês 3', t: 0.25 },
      { label: 'Mês 6', t: 0.5 },
      { label: 'Mês 9', t: 0.75 },
      { label: 'Mês 12 (Projeção)', t: 1.0 },
    ];

    ctx.textAlign = 'center';
    xSteps.forEach((step) => {
      const x = marginX + step.t * usableWidth;
      ctx.fillText(step.label, x, startY + 32);
    });

    // Calculate Active Curve Points based on Progress p (0.0 -> 1.0)
    const totalPoints = 140;
    const activePointsCount = Math.floor(totalPoints * p);

    let lastX = marginX;
    let lastY = startY;

    if (activePointsCount >= 2) {
      ctx.beginPath();
      for (let i = 0; i <= activePointsCount; i++) {
        const t = i / totalPoints;
        const x = marginX + t * usableWidth;

        const wave = Math.sin(t * Math.PI * 2.5) * (height * 0.032);
        const ripple = Math.cos(t * Math.PI * 5) * (height * 0.012);
        const exponentialRise = Math.pow(t, 1.25) * totalRise;

        const y = startY - exponentialRise + wave + ripple;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const xc = (lastX + x) / 2;
          const yc = (lastY + y) / 2;
          ctx.quadraticCurveTo(lastX, lastY, xc, yc);
        }
        lastX = x;
        lastY = y;
      }

      // Chart Gradient Area Fill
      ctx.lineTo(lastX, startY + 5);
      ctx.lineTo(marginX, startY + 5);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(0, peakY, 0, startY);
      fillGrad.addColorStop(0, `rgba(16, 185, 129, ${0.35 * Math.min(p * 1.5, 1)})`);
      fillGrad.addColorStop(0.7, `rgba(16, 185, 129, ${0.06 * p})`);
      fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Chart Stroke Line
      ctx.beginPath();
      lastX = marginX;
      lastY = startY;
      for (let i = 0; i <= activePointsCount; i++) {
        const t = i / totalPoints;
        const x = marginX + t * usableWidth;
        const wave = Math.sin(t * Math.PI * 2.5) * (height * 0.032);
        const ripple = Math.cos(t * Math.PI * 5) * (height * 0.012);
        const exponentialRise = Math.pow(t, 1.25) * totalRise;
        const y = startY - exponentialRise + wave + ripple;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const xc = (lastX + x) / 2;
          const yc = (lastY + y) / 2;
          ctx.quadraticCurveTo(lastX, lastY, xc, yc);
        }
        lastX = x;
        lastY = y;
      }
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Leading Node Dot
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. DYNAMIC PILL POSITIONING: Make the Projeção Financeira pill follow the lead node of the chart!
    if (pillRef.current) {
      // Clamp X position so pill stays nicely within screen margins
      const isMobile = width < 640;
      const pillHalfWidth = isMobile ? 115 : 190;
      const clampedX = Math.min(Math.max(lastX, pillHalfWidth), width - pillHalfWidth);

      // Clamp Y position so pill stays at least 90px below top (never cut off by top navbar!)
      const clampedY = Math.max(lastY - 24, 95);

      pillRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -100%)`;
    }
  };

  const currentCurrency = scrollProgress * 60000;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '400vh', // 400vh container for extended smooth scroll
        width: '100%',
        backgroundColor: '#07090E',
        margin: 0,
        padding: 0,
      }}
    >
      {/* 1. Fullscreen Sticky Viewport (100vw x 100vh) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#07090E',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Fullscreen Video Element (100% cover) */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            opacity: hasVideo ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1,
          }}
        />

        {/* Fullscreen 60fps Dynamic Canvas Chart WITH Financial Numbers (100vw x 100vh cover) */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            opacity: hasVideo ? 0.35 : 1,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Dynamic Floating Pill Button following the Graph Lead Node (100% visible, never cut off!) */}
        <div
          ref={pillRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 20px rgba(16, 185, 129, 0.2)',
            pointerEvents: 'none',
            willChange: 'transform',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.78125rem', fontWeight: 800, letterSpacing: '0.04em' }}>
            <Sparkles size={15} />
            <span className="pill-prefix">PROJEÇÃO FINANCEIRA:</span>
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }} className="tabular-nums">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentCurrency)}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#34D399', fontSize: '0.78125rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
            <TrendingUp size={14} />
            <span>+{(scrollProgress * 450).toFixed(1)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
