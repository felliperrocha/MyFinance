'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import LandingView from '@/components/layout/LandingView';
import AuthModal from '@/components/auth/AuthModal';
import MetricCard from '@/components/dashboard/MetricCard';
import EvolutionChart from '@/components/dashboard/EvolutionChart';
import FeaturedGoal from '@/components/dashboard/FeaturedGoal';
import FeaturedInsight from '@/components/dashboard/FeaturedInsight';
import TransactionModal from '@/components/transactions/TransactionModal';
import GoalModal from '@/components/goals/GoalModal';
import ContributionModal from '@/components/goals/ContributionModal';
import GoalDetailModal from '@/components/goals/GoalDetailModal';
import { FinancialSummary, Goal, Insight, Category, User } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, setUser, logout } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Dashboard Modals state
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isGoalDetailOpen, setIsGoalDetailOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const fetchUserData = async () => {
    try {
      const [sumRes, goalsRes, insRes, catRes, txRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/goals'),
        fetch('/api/insights'),
        fetch('/api/categories'),
        fetch('/api/transactions'),
      ]);

      const sumData = await sumRes.json();
      const goalsData = await goalsRes.json();
      const insData = await insRes.json();
      const catData = await catRes.json();
      const txData = await txRes.json();

      setSummary(sumData);
      setGoals(goalsData || []);
      setInsights(insData || []);
      setCategories(catData || []);
      setRecentTransactions((txData.transactions || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('resetEmail') || params.get('resetCode')) {
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setSummary(null);
      setGoals([]);
      setInsights([]);
      setRecentTransactions([]);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setSummary(null);
    setGoals([]);
    setRecentTransactions([]);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    fetchUserData();
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleOpenGoalDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDetailOpen(true);
  };

  const handleOpenContribution = (goal?: Goal) => {
    if (goal) setSelectedGoal(goal);
    else if (goals.length > 0) setSelectedGoal(goals[0]);
    setIsContributionModalOpen(true);
  };

  const featuredInsight = insights.length > 0 ? insights[0] : null;

  return (
    <>
      <Header
        user={user}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onLogout={handleLogout}
      />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* If user is NOT logged in: show Landing View with Login/Register triggers */}
        {!user ? (
          <LandingView
            onOpenLogin={handleOpenLogin}
            onOpenRegister={handleOpenRegister}
          />
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Top 4 Financial Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <MetricCard
                title="Saldo Atual Consolidado"
                amount={summary?.current_balance || 0}
                icon={Wallet}
                changePct={summary?.income_change_pct}
                changeLabel="vs. mês anterior"
                isPositiveChangeGood={true}
              />
              <MetricCard
                title="Receitas do Mês"
                amount={summary?.monthly_income || 0}
                icon={TrendingUp}
                changePct={8.2}
                changeLabel="vs. mês anterior"
                isPositiveChangeGood={true}
              />
              <MetricCard
                title="Despesas do Mês"
                amount={summary?.monthly_expenses || 0}
                icon={TrendingDown}
                changePct={-3.8}
                changeLabel="redução de custos"
                isPositiveChangeGood={false}
              />
              <MetricCard
                title="Economia Mensal (Poupança)"
                amount={summary?.monthly_savings || 0}
                icon={PiggyBank}
                changePct={summary?.savings_rate ? Math.round(summary.savings_rate) : undefined}
                changeLabel="taxa de poupança da receita"
                isPositiveChangeGood={true}
              />
            </div>

            {/* Featured Automatic Deterministic Insight */}
            <FeaturedInsight insight={featuredInsight} />

            {/* Middle Section: Evolution Chart & Goals Progress */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <EvolutionChart />
              <FeaturedGoal
                goals={goals}
                onSelectGoal={handleOpenGoalDetail}
                onOpenNewGoal={() => setIsGoalModalOpen(true)}
              />
            </div>

            {/* Bottom Section: Recent Transactions Ledger */}
            <div className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                    Últimas Movimentações
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-medium-gray)', marginTop: '0.15rem' }}>
                    Registros recentes de receitas e despesas.
                  </p>
                </div>
                <Link
                  href="/transactions"
                  className="mf-btn mf-btn-secondary mf-btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  <span>Ver todas</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-medium-gray)' }}>
                      <th style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>Data</th>
                      <th style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>Descrição</th>
                      <th style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>Categoria</th>
                      <th style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>Tipo</th>
                      <th style={{ padding: '0.6rem 0.75rem', fontWeight: 500, textAlign: 'right' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-medium-gray)' }}>
                          Nenhuma movimentação registrada ainda. Acesse a aba Movimentações para cadastrar.
                        </td>
                      </tr>
                    ) : (
                      recentTransactions.map((t) => {
                        const isIncome = t.transaction_type === 'income';
                        return (
                          <tr
                            key={t.id}
                            style={{
                              borderBottom: '1px solid var(--color-border-subtle)',
                              transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '0.75rem', color: 'var(--color-medium-gray)' }}>{formatDate(t.date)}</td>
                            <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--color-primary-black)' }}>{t.description}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--color-medium-gray)' }}>{t.category_name || (isIncome ? 'Receita' : 'Geral')}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span className={isIncome ? 'mf-badge mf-badge-positive' : 'mf-badge mf-badge-neutral'}>
                                {isIncome ? 'Receita' : 'Despesa'}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: '0.75rem',
                                fontWeight: 600,
                                textAlign: 'right',
                                color: isIncome ? 'var(--color-positive-text)' : 'var(--color-primary-black)',
                              }}
                              className="tabular-nums"
                            >
                              {isIncome ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Dashboard Modals */}
      <TransactionModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        defaultType="income"
        categories={categories}
        onSuccess={fetchUserData}
      />

      <TransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        defaultType="expense"
        categories={categories}
        onSuccess={fetchUserData}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={fetchUserData}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        goal={selectedGoal}
        onSuccess={fetchUserData}
      />

      <GoalDetailModal
        isOpen={isGoalDetailOpen}
        onClose={() => setIsGoalDetailOpen(false)}
        goal={selectedGoal}
        onOpenContribution={() => setIsContributionModalOpen(true)}
      />
    </>
  );
}
