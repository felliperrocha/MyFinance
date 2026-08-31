'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import GoalModal from '@/components/goals/GoalModal';
import ContributionModal from '@/components/goals/ContributionModal';
import GoalDetailModal from '@/components/goals/GoalDetailModal';
import AuthModal from '@/components/auth/AuthModal';
import ProgressGauge from '@/components/ui/ProgressGauge';
import { Goal } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Target, Plus, Calendar, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function GoalsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const fetchGoals = async () => {
    if (!user) return;
    try {
      setLoadingGoals(true);
      const res = await fetch('/api/goals');
      const data = await res.json();
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setGoals([]);
    }
  }, [user]);

  const handleOpenDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailModalOpen(true);
  };

  const handleOpenContribution = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsContributionModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setGoals([]);
  };

  const totalTarget = goals.reduce((acc, cur) => acc + Number(cur.target_amount), 0);
  const totalCurrent = goals.reduce((acc, cur) => acc + Number(cur.current_amount), 0);
  const totalPct = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <>
      <Header
        user={user}
        onOpenLogin={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {authLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--color-medium-gray)' }}>
              <div style={{ width: '22px', height: '22px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-black)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              <span style={{ fontSize: '0.8125rem' }}>Carregando...</span>
            </div>
          </div>
        ) : !user ? (
          <div className="mf-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
              Acesse sua conta para gerenciar suas metas
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-medium-gray)', maxWidth: '480px' }}>
              Defina objetivos de curto, médio e longo prazo, acompanhe o percentual acumulado e visualize previsões de conclusão.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="mf-btn mf-btn-primary"
              >
                <LogIn size={15} />
                <span>Entrar na Conta</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="mf-btn mf-btn-secondary"
              >
                <span>Criar Conta</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
                  Metas Financeiras & Planejamento
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
                  Acompanhe seu progresso de acumulação, histórico de contribuições e projeções de conquista.
                </p>
              </div>

              <button onClick={() => setIsGoalModalOpen(true)} className="mf-btn mf-btn-primary">
                <Plus size={16} />
                <span>Criar Nova Meta</span>
              </button>
            </div>

            {/* Global Progress Bar Card */}
            <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Progresso Geral do Patrimônio em Metas
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)', marginTop: '0.2rem' }} className="tabular-nums">
                    {formatCurrency(totalCurrent)} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-medium-gray)' }}>de {formatCurrency(totalTarget)}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="mf-badge mf-badge-positive" style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}>
                    {totalPct}% Conquistado
                  </span>
                </div>
              </div>

              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--color-light-gray)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${totalPct}%`,
                    backgroundColor: 'var(--color-primary-black)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Goals Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {goals.length === 0 ? (
                <div className="mf-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2.5rem', color: 'var(--color-medium-gray)' }}>
                  Nenhuma meta cadastrada ainda. Clique em &quot;Criar Nova Meta&quot; acima para começar!
                </div>
              ) : (
                goals.map((goal) => {
                  const pct = goal.percentage || 0;
                  const isCompleted = pct >= 100;

                  return (
                    <div
                      key={goal.id}
                      className="mf-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => handleOpenDetail(goal)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-medium-gray)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Prioridade {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-black)', marginTop: '0.15rem' }}>
                            {goal.title}
                          </h3>
                        </div>
                        <span className={isCompleted ? 'mf-badge mf-badge-positive' : goal.status === 'attention' ? 'mf-badge mf-badge-warning' : 'mf-badge mf-badge-neutral'}>
                          {isCompleted ? 'Concluída' : goal.status === 'attention' ? 'Atenção' : 'No Prazo'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <ProgressGauge
                          percentage={pct}
                          size={90}
                          strokeWidth={8}
                          status={goal.status}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', display: 'block' }}>Acumulado</span>
                            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-black)' }} className="tabular-nums">
                              {formatCurrency(goal.current_amount)}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', display: 'block' }}>Alvo: {formatCurrency(goal.target_amount)}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--color-border-subtle)',
                          paddingTop: '0.75rem',
                          fontSize: '0.75rem',
                          color: 'var(--color-medium-gray)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          <span>Prazo: {formatDate(goal.deadline)}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenContribution(goal);
                          }}
                          className="mf-btn mf-btn-secondary mf-btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        >
                          <Plus size={13} />
                          <span>Aporte</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => fetchGoals()}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={fetchGoals}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />

      <GoalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        goal={selectedGoal}
        onOpenContribution={() => setIsContributionModalOpen(true)}
      />
    </>
  );
}
