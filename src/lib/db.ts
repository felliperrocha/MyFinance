import { Pool } from 'pg';
import { DEFAULT_CATEGORIES } from './seed';
import {
  User,
  Category,
  Income,
  Expense,
  Budget,
  Goal,
  GoalContribution,
  Strategy,
  Insight,
} from './types';

// Global singleton pool for connection reuse
declare global {
  var _neonPool: Pool | undefined;
}

export function getDatabasePool(): Pool | null {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!databaseUrl || databaseUrl.includes('sample-123456')) {
    return null;
  }

  if (!global._neonPool) {
    global._neonPool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return global._neonPool;
}

// In-Memory Fallback
export interface LocalStoreState {
  users: User[];
  categories: Category[];
  income: Income[];
  expenses: Expense[];
  budgets: Budget[];
  goals: Goal[];
  goal_contributions: GoalContribution[];
  strategies: Strategy[];
  insights: Insight[];
}

export const memoryStore: LocalStoreState = {
  users: [],
  categories: [],
  income: [],
  expenses: [],
  budgets: [],
  goals: [],
  goal_contributions: [],
  strategies: [],
  insights: [],
};

export async function initPostgresSchema(dbPool: Pool): Promise<void> {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      currency TEXT DEFAULT 'BRL',
      month_start_day INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS income (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      date DATE NOT NULL,
      income_type TEXT NOT NULL,
      recurrence TEXT NOT NULL DEFAULT 'one-time',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category_id TEXT,
      description TEXT NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      date DATE NOT NULL,
      payment_method TEXT NOT NULL,
      recurrence TEXT NOT NULL DEFAULT 'one-time',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      monthly_limit NUMERIC(12, 2) NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      target_amount NUMERIC(12, 2) NOT NULL,
      current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      deadline DATE NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'on_track',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goal_contributions (
      id TEXT PRIMARY KEY,
      goal_id TEXT NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      contribution_date DATE NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS strategies (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      strategy_type TEXT NOT NULL,
      estimated_monthly_impact NUMERIC(12, 2) DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      insight_type TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date DESC);
    CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);
    CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);
    CREATE INDEX IF NOT EXISTS idx_budgets_user ON budgets(user_id, month, year);
    CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions(goal_id);
    CREATE INDEX IF NOT EXISTS idx_strategies_user ON strategies(user_id);
    CREATE INDEX IF NOT EXISTS idx_insights_user ON insights(user_id);
  `;

  await dbPool.query(schemaSql);
}

export async function seedUserDefaultCategories(userId: string): Promise<void> {
  const pool = getDatabasePool();
  const defaultCats = DEFAULT_CATEGORIES.map((c) => ({
    id: `cat-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    name: c.name,
    icon: c.icon,
    type: c.type,
    created_at: new Date().toISOString(),
  }));

  if (pool) {
    const values: any[] = [];
    const placeholders = defaultCats
      .map((cat, i) => {
        const offset = i * 5;
        values.push(cat.id, userId, cat.name, cat.icon, cat.type);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
      })
      .join(', ');

    await pool.query(
      `INSERT INTO categories (id, user_id, name, icon, type) VALUES ${placeholders}`,
      values
    );
  } else {
    memoryStore.categories.push(...defaultCats);
  }
}
