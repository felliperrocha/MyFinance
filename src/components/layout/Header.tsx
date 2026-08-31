'use client';

import React from 'react';
import { LogIn, UserPlus, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/lib/types';

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
        {currentUser ? (
          <>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Olá, {firstName}.
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
              {capitalizedDate} — Painel de Controle Financeiro
            </p>
          </>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'var(--color-primary-black)',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-bg-main)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 20V4l9 9 9-9v16" />
                </svg>
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-primary-black)' }}>
                MyFinance
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.1rem' }}>
              Planeje. Controle. Conquiste.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
        {/* Dark / Light Theme Toggle Button */}
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

        {currentUser ? (
          <>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mf-btn mf-btn-secondary mf-btn-sm"
              style={{ color: 'var(--color-medium-gray)' }}
              title="Encerrar sessão"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </>
        ) : !isLoading ? (
          <>
            <button
              onClick={onOpenLogin}
              className="mf-btn mf-btn-secondary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <LogIn size={15} />
              <span>Entrar</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="mf-btn mf-btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.1rem' }}
            >
              <UserPlus size={15} />
              <span>Cadastrar</span>
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
