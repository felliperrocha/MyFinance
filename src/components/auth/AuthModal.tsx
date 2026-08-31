'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { User } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: (user: User) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}: AuthModalProps) {
  const { setUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('A confirmação de senha não confere com a senha digitada.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body =
        mode === 'register'
          ? { name, email, password, confirmPassword }
          : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro. Verifique seus dados.');
        return;
      }

      if (data.user) {
        setUser(data.user);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        if (onSuccess) onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Acessar MyFinance' : 'Criar sua Conta'}
      subtitle={
        mode === 'login'
          ? 'Entre com seu e-mail e senha para gerenciar suas finanças.'
          : 'Cadastre-se para planejar, controlar e conquistar seus objetivos.'
      }
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Toggle Mode Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '3px',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'login' ? 'var(--color-surface-card)' : 'transparent',
              color: mode === 'login' ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
              boxShadow: mode === 'login' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'register' ? 'var(--color-surface-card)' : 'transparent',
              color: mode === 'register' ? 'var(--color-primary-black)' : 'var(--color-medium-gray)',
              boxShadow: mode === 'register' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Criar Conta
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger-text)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
            }}
          >
            <AlertCircle size={15} color="var(--color-danger-text)" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label className="mf-label">Nome Completo</label>
              <input
                type="text"
                className="mf-input"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="mf-label">E-mail</label>
            <input
              type="email"
              className="mf-input"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
            />
          </div>

          <div>
            <label className="mf-label">Senha</label>
            <input
              type="password"
              className="mf-input"
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="mf-label">Confirmação da Senha</label>
              <input
                type="password"
                className="mf-input"
                placeholder="Repita a senha digitada"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="mf-btn mf-btn-primary"
              style={{ width: '100%', padding: '0.7rem' }}
            >
              {loading
                ? 'Processando...'
                : mode === 'login'
                ? 'Entrar na Conta'
                : 'Criar Minha Conta'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-medium-gray)' }}>
          {mode === 'login' ? (
            <span>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-black)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Cadastre-se gratuitamente
              </button>
            </span>
          ) : (
            <span>
              Já possui conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-black)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Faça login
              </button>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}
