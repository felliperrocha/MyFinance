'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Database, User, Bell, Check, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [monthStartDay, setMonthStartDay] = useState(1);
  const [dbStatus, setDbStatus] = useState<any>({
    type: 'Armazenamento Neon PostgreSQL Nuvem',
    status: 'connected',
    host: 'Neon Cloud Pooler',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCurrency(user.currency || 'BRL');
      setMonthStartDay(user.month_start_day || 1);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.database) {
          setDbStatus(data.database);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, currency, month_start_day: monthStartDay }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        await refreshUser();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '840px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
            Configurações da Conta
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
            Gerencie seu perfil, preferências financeiras, notificações e conexão com banco de dados.
          </p>
        </div>

        {savedSuccess && (
          <div
            style={{
              backgroundColor: 'var(--color-positive-bg)',
              border: '1px solid var(--color-positive-border)',
              color: 'var(--color-positive-text)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <Check size={16} />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Section */}
          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <User size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Perfil do Usuário
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="mf-label">Nome Completo</label>
                <input
                  type="text"
                  className="mf-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mf-label">E-mail</label>
                <input
                  type="email"
                  className="mf-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Preferences */}
          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <Bell size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Preferências Financeiras & Notificações
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="mf-label">Moeda Padrão</label>
                <select
                  className="mf-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="mf-label">Dia de Início do Mês Financeiro</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="mf-input"
                  value={monthStartDay}
                  onChange={(e) => setMonthStartDay(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>

          {/* Database & Neon PostgreSQL Status */}
          <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <Database size={18} color="var(--color-primary-black)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                Persistência & Neon PostgreSQL
              </h3>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-medium-gray)' }}>Motor de Armazenamento Ativo:</span>
                <span className="mf-badge mf-badge-positive" style={{ fontWeight: 600 }}>
                  {dbStatus.type}
                </span>
              </div>
              <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.4 }}>
                Para conectar seu banco de dados na nuvem da <strong>Neon PostgreSQL</strong>, configure sua variável de ambiente <code style={{ backgroundColor: 'var(--color-light-gray)', padding: '2px 5px', borderRadius: '3px' }}>DATABASE_URL</code> no arquivo <code style={{ backgroundColor: 'var(--color-light-gray)', padding: '2px 5px', borderRadius: '3px' }}>.env.local</code>. O MyFinance gerencia as tabelas e migrações automaticamente.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="mf-btn mf-btn-primary">
              <Save size={16} />
              <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
