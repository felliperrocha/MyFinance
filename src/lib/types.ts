export type IncomeType = 'salary' | 'benefit' | 'extra' | 'other';
export type RecurrenceType = 'monthly' | 'one-time' | 'custom';
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'transfer' | 'other';
export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalStatus = 'on_track' | 'attention' | 'at_risk' | 'completed';
export type StrategyType = 'savings' | 'organization' | 'investment';
export type StrategyStatus = 'active' | 'paused' | 'completed';
export type InsightType = 'savings' | 'alert' | 'goal' | 'behavior';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  currency?: string;
  month_start_day?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  type: 'expense' | 'income';
  created_at?: string;
}

export interface Income {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  income_type: IncomeType;
  recurrence: RecurrenceType;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  category_name?: string;
  description: string;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  recurrence: RecurrenceType;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  category_name?: string;
  monthly_limit: number;
  spent_amount?: number;
  percentage_used?: number;
  month: number;
  year: number;
  created_at?: string;
  updated_at?: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  amount: number;
  contribution_date: string;
  notes?: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  priority: GoalPriority;
  status: GoalStatus;
  percentage?: number;
  remaining_amount?: number;
  contributions?: GoalContribution[];
  created_at?: string;
  updated_at?: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  goal_id?: string | null;
  goal_title?: string;
  title: string;
  description: string;
  strategy_type: StrategyType;
  estimated_monthly_impact: number;
  status: StrategyStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Insight {
  id: string;
  user_id: string;
  title: string;
  content: string;
  insight_type: InsightType;
  is_read: boolean;
  created_at: string;
}

export interface FinancialSummary {
  current_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_savings: number;
  savings_rate: number;
  income_change_pct: number;
  expenses_change_pct: number;
}
