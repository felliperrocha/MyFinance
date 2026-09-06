'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { User } from '@/lib/types';
import { AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  onSuccess?: (user: User) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}: AuthModalProps) {
  const { setUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [needsSmtpConfig, setNeedsSmtpConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Check if opened via reset password link (?resetEmail=...&resetCode=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('resetEmail');
      const urlCode = params.get('resetCode');
      if (urlEmail && urlCode) {
        setMode('forgot');
        setForgotStep('verify');
        setEmail(urlEmail);
        setCode(urlCode);
        return;
      }
    }

    setMode(initialMode);
    setForgotStep('request');
    setError(null);
    setSuccessMessage(null);
    setEmailPreviewUrl(null);
    setNeedsSmtpConfig(false);
  }, [initialMode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setEmailPreviewUrl(null);

    // --- FORGOT PASSWORD STEP 1: REQUEST CODE & DISPATCH EMAIL ---
    if (mode === 'forgot' && forgotStep === 'request') {
      if (!email || !email.includes('@')) {
        setError('Por favor, informe um endereço de e-mail válido.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'request-code', email }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Não foi possível enviar o e-mail de recuperação.');
          return;
        }

        // If in dev mode without SMTP, auto-populate code so user is not blocked
        setCode(data.devCode || '');
        setSuccessMessage(data.message || 'Código de verificação enviado! Verifique seu e-mail.');
        if (data.previewUrl) {
          setEmailPreviewUrl(data.previewUrl);
        }
        if (data.needsSmtpConfig) {
          setNeedsSmtpConfig(true);
        }
        setForgotStep('verify');
      } catch (err) {
        console.error('Forgot password step 1 error:', err);
        setError('Falha de conexão com o servidor. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- FORGOT PASSWORD STEP 2: VERIFY CODE & REDEFINE ---
    if (mode === 'forgot' && forgotStep === 'verify') {
      if (!code || code.trim().length < 4) {
        setError('Por favor, digite o código de 6 dígitos que você recebeu por e-mail.');
        return;
      }
      if (password.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('A confirmação não coincide com a nova senha digitada.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reset-password',
            email,
            code,
            newPassword: password,
            confirmPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Código incorreto ou expirado. Verifique o e-mail recebido.');
          return;
        }

        setSuccessMessage('Senha alterada com sucesso! Redirecionando para login...');
        setPassword('');
        setConfirmPassword('');
        setCode('');
        setTimeout(() => {
          setMode('login');
          setForgotStep('request');
          setSuccessMessage(null);
        }, 2000);
      } catch (err) {
        console.error('Forgot password step 2 error:', err);
        setError('Falha ao redefinir a senha. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- REGISTER VALIDATION ---
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

    // --- LOGIN & REGISTER ---
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
        setError(data.error || 'Credenciais inválidas. Verifique seus dados.');
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
      setError('Erro de conexão ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Falha ao conectar com o Google.');
        return;
      }
      if (data.user) {
        setUser(data.user);
        if (onSuccess) onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Não foi possível conectar com o serviço do Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Acessar MyFinance'
          : mode === 'register'
          ? 'Criar sua Conta'
          : forgotStep === 'request'
          ? 'Recuperar Senha'
          : 'Validar Código & Nova Senha'
      }
      subtitle={
        mode === 'login'
          ? 'Entre com sua conta para gerenciar seus lançamentos e orçamentos.'
          : mode === 'register'
          ? 'Cadastre-se para planejar, controlar e conquistar seus objetivos.'
          : forgotStep === 'request'
          ? 'Informe seu e-mail cadastrado para receber o código seguro de 6 dígitos.'
          : `Insira o código de 6 dígitos enviado para ${email} e defina sua nova senha.`
      }
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Toggle Mode Tabs (when not in forgot mode) */}
        {mode !== 'forgot' ? (
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
                setSuccessMessage(null);
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
                setSuccessMessage(null);
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
        ) : (
          <button
            type="button"
            onClick={() => {
              if (forgotStep === 'verify') {
                setForgotStep('request');
              } else {
                setMode('login');
              }
              setError(null);
              setSuccessMessage(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-medium-gray)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              alignSelf: 'flex-start',
            }}
          >
            <ArrowLeft size={14} />
            <span>{forgotStep === 'verify' ? 'Voltar e reenviar código' : 'Voltar para o Login'}</span>
          </button>
        )}

        {/* Google Sign In Button */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-primary-black)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-card)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Conectando ao Google...' : 'Continuar com o Google'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', textTransform: 'uppercase' }}>
                ou com e-mail
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            </div>
          </>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-positive-bg)',
              border: '1px solid var(--color-positive-border)',
              color: 'var(--color-positive-text)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={15} color="var(--color-positive-text)" />
              <span>{successMessage}</span>
            </div>

            {/* Test inbox link if returned */}
            {emailPreviewUrl && (
              <a
                href={emailPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-positive-text)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  marginTop: '0.25rem',
                }}
              >
                <ExternalLink size={13} />
                <span>Visualizar e-mail de teste no navegador</span>
              </a>
            )}
          </div>
        )}

        {/* Informative alert if SMTP is not yet set */}
        {needsSmtpConfig && (
          <div
            style={{
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-dark-gray)',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
            }}
          >
            <Info size={14} color="var(--color-medium-gray)" />
            <span>
              Para envio de e-mails para caixas de entrada reais (como Gmail), configure <code>SMTP_USER</code> e <code>SMTP_PASS</code> no arquivo <code>.env.local</code> ou na Vercel.
            </span>
          </div>
        )}

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
          {/* REGISTER: Name input */}
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

          {/* Email input for login, register, and forgot password step 1 */}
          {(mode !== 'forgot' || forgotStep === 'request') && (
            <div>
              <label className="mf-label">E-mail</label>
              <input
                type="email"
                className="mf-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode !== 'register'}
              />
            </div>
          )}

          {/* FORGOT STEP 2: Verification Code input (Starts clean without prefill) */}
          {mode === 'forgot' && forgotStep === 'verify' && (
            <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--color-primary-black)" />
                <label className="mf-label" style={{ marginBottom: 0, fontWeight: 600 }}>
                  Código de Segurança (6 dígitos)
                </label>
              </div>
              <input
                type="text"
                maxLength={6}
                className="mf-input"
                placeholder="Digite o código do e-mail"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.15rem', fontWeight: 700 }}
                autoFocus
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--color-medium-gray)', marginTop: '0.4rem', textAlign: 'center' }}>
                Código válido por 15 minutos.
              </p>
            </div>
          )}

          {/* Password input */}
          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="mf-label" style={{ marginBottom: 0 }}>
                  Senha
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep('request');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary-black)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="mf-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {/* FORGOT STEP 2: New Password & Confirm Password */}
          {mode === 'forgot' && forgotStep === 'verify' && (
            <>
              <div>
                <label className="mf-label">Nova Senha</label>
                <input
                  type="password"
                  className="mf-input"
                  placeholder="Mínimo de 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mf-label">Confirmação da Nova Senha</label>
                <input
                  type="password"
                  className="mf-input"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* REGISTER: Password confirmation */}
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
              disabled={loading || googleLoading}
              className="mf-btn mf-btn-primary"
              style={{ width: '100%', padding: '0.7rem' }}
            >
              {loading
                ? 'Enviando...'
                : mode === 'login'
                ? 'Entrar na Conta'
                : mode === 'register'
                ? 'Criar Minha Conta'
                : forgotStep === 'request'
                ? 'Enviar Código de Segurança'
                : 'Confirmar e Redefinir Senha'}
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
          ) : mode === 'register' ? (
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
          ) : (
            <span>
              Lembrou sua senha?{' '}
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
                Voltar ao login
              </button>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}
