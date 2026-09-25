'use client';

import React, { useEffect, useState } from 'react';
import {
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Compass,
  Lightbulb,
  Sliders,
  Settings,
  HelpCircle,
} from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<'hero' | 'recursos' | 'sobre'>('hero');
  const [isPublicMenuOpen, setIsPublicMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sobreEl = document.getElementById('sobre');
      const recursosEl = document.getElementById('recursos');

      if (sobreEl && sobreEl.getBoundingClientRect().top <= 320) {
        setActiveSection('sobre');
      } else if (recursosEl && recursosEl.getBoundingClientRect().top <= 320) {
        setActiveSection('recursos');
      } else {
        setActiveSection('hero');
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
    setIsAuthMenuOpen(false);
    if (propLogout) {
      propLogout();
    } else {
      await auth.logout();
    }
  };

  const scrollToSection = (id: string) => {
    setIsPublicMenuOpen(false);
    if (id === 'hero' || id === 'recursos' || id === 'sobre') {
      setActiveSection(id);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user is LOGGED IN: render Authenticated Top Header
  if (currentUser) {
    return (
      <header className="auth-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
            Olá, {firstName}.
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
            {capitalizedDate} — Painel de Controle Financeiro
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
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

          {/* Authenticated Mobile Hamburger Button */}
          <button
            onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
            className="auth-mobile-hamburger-btn"
            title="Menu de navegação"
            aria-label="Menu"
          >
            {isAuthMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Authenticated Mobile Menu Drawer */}
        {isAuthMenuOpen && (
          <div className="auth-mobile-nav-drawer">
            <Link
              href="/"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/transactions"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <ArrowLeftRight size={18} />
              <span>Movimentações</span>
            </Link>
            <Link
              href="/budgets"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <PieChart size={18} />
              <span>Orçamento</span>
            </Link>
            <Link
              href="/goals"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <Target size={18} />
              <span>Metas</span>
            </Link>
            <Link
              href="/strategies"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <Compass size={18} />
              <span>Estratégias</span>
            </Link>
            <Link
              href="/insights"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <Lightbulb size={18} />
              <span>Insights</span>
            </Link>
            <Link
              href="/simulations"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <Sliders size={18} />
              <span>Simulações</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <Settings size={18} />
              <span>Configurações</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setIsAuthMenuOpen(false)}
              className="mf-btn mf-btn-secondary"
              style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem' }}
            >
              <HelpCircle size={18} />
              <span>Central de Ajuda</span>
            </Link>
          </div>
        )}
      </header>
    );
  }

  // PUBLIC UNAUTHENTICATED TOP HEADER (Matching the Reference Image Exactly)
  return (
    <header
      className={`landing-header ${isScrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: isScrolled ? 'rgba(7, 9, 14, 0.92)' : '#07090E',
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

      {/* Center Nav Links (Desktop) */}
      <nav
        className="landing-header-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <button
          onClick={() => scrollToSection('hero')}
          className={`landing-nav-btn ${activeSection === 'hero' ? 'active' : ''}`}
        >
          Início
        </button>
        <button
          onClick={() => scrollToSection('recursos')}
          className={`landing-nav-btn ${activeSection === 'recursos' ? 'active' : ''}`}
        >
          Recursos
        </button>
        <button
          onClick={() => scrollToSection('sobre')}
          className={`landing-nav-btn ${activeSection === 'sobre' ? 'active' : ''}`}
        >
          Sobre
        </button>
      </nav>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {!isLoading && (
          <>
            <button
              onClick={onOpenLogin}
              className="btn-pill-dark"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.84375rem' }}
            >
              <span>Entrar</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="btn-pill-white"
              style={{ padding: '0.55rem 1.35rem', fontSize: '0.84375rem' }}
            >
              <span>Cadastrar</span>
            </button>
          </>
        )}

        {/* Public Mobile Hamburger Button */}
        <button
          onClick={() => setIsPublicMenuOpen(!isPublicMenuOpen)}
          className="mobile-hamburger-btn"
          title="Menu de navegação"
          aria-label="Menu"
        >
          {isPublicMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Public Mobile Menu Drawer */}
      {isPublicMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            onClick={() => scrollToSection('hero')}
            className={`landing-nav-btn ${activeSection === 'hero' ? 'active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.5rem 0', justifyContent: 'flex-start' }}
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('recursos')}
            className={`landing-nav-btn ${activeSection === 'recursos' ? 'active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.5rem 0', justifyContent: 'flex-start' }}
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection('sobre')}
            className={`landing-nav-btn ${activeSection === 'sobre' ? 'active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.5rem 0', justifyContent: 'flex-start' }}
          >
            Sobre
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => {
                setIsPublicMenuOpen(false);
                onOpenRegister?.();
              }}
              className="btn-pill-white"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
            >
              <span>Cadastrar gratuitamente</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setIsPublicMenuOpen(false);
                onOpenLogin?.();
              }}
              className="btn-pill-dark"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
            >
              <span>Entrar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
