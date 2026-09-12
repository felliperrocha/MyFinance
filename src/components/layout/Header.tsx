'use client';

import React, { useEffect, useState } from 'react';
import { LogIn, UserPlus, LogOut, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/lib/types';
import Link from 'next/link';

interface HeaderProps {
  user?: User | null;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
}

export default function Header({
  user: propUser,
  onOpenLogin,
  onOpenRegister,
  onLogout: propLogout,
}: HeaderProps) {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const currentUser = propUser !== undefined ? propUser : auth.user;
  const isLoading = auth.loading && propUser === undefined;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : '';

  const handleLogout = async () => {
    if (propLogout) {
      propLogout();
    } else {
      await auth.logout();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user is LOGGED IN: render Authenticated Top Header
  if (currentUser) {
    return (
      <header
        style={{
          backgroundColor: 'var(--color-surface-white)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1.1rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          minHeight: '70px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Olá, {firstName}.
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
            {capitalizedDate} — Painel de Controle Financeiro
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button
            onClick={toggleTheme}
            className="mf-btn mf-btn-secondary mf-btn-sm"
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              color: 'var(--color-primary-black)',
            }}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={handleLogout}
            className="mf-btn mf-btn-secondary mf-btn-sm"
            style={{ color: 'var(--color-medium-gray)' }}
            title="Encerrar sessão"
          >
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>
      </header>
    );
  }

  // PUBLIC UNAUTHENTICATED TOP HEADER (Matching the Reference Image Exactly)
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(7, 9, 14, 0.9)' : '#07090E',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '1.1rem 3.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Brand Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07090E',
            fontWeight: 800,
            fontSize: '1rem',
          }}
        >
          M
        </div>
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          MyFinance
        </span>
      </Link>

      {/* Center Nav Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.25rem',
        }}
      >
        <button
          onClick={() => scrollToSection('hero')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'pointer',
            borderBottom: '2px solid #FFFFFF',
            paddingBottom: '2px',
          }}
        >
          Início
        </button>
        <button
          onClick={() => scrollToSection('como-funciona')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#94A3B8',
            cursor: 'pointer',
          }}
        >
          Como funciona
        </button>
        <button
          onClick={() => scrollToSection('recursos')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#94A3B8',
            cursor: 'pointer',
          }}
        >
          Recursos
        </button>
        <button
          onClick={() => scrollToSection('sobre')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#94A3B8',
            cursor: 'pointer',
          }}
        >
          Sobre
        </button>
      </nav>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {!isLoading && (
          <>
            <button
              onClick={onOpenLogin}
              className="btn-pill-dark"
              style={{ padding: '0.55rem 1.4rem', fontSize: '0.84375rem' }}
            >
              <span>Entrar</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="btn-pill-white"
              style={{ padding: '0.55rem 1.5rem', fontSize: '0.84375rem' }}
            >
              <span>Cadastrar</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
