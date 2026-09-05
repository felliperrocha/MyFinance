import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
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

// Support node environment for websockets
if (typeof window === 'undefined') {
  try {
    neonConfig.webSocketConstructor = ws;
  } catch {
    // ignore
  }
}

export class NeonDatabaseAdapter {
  private sql: any;

  constructor(databaseUrl: string) {
    this.sql = neon(databaseUrl);
  }

  async query(text: string, params: any[] = []): Promise<{ rows: any[] }> {
    try {
      // Execute via instant HTTP neon driver (zero websocket latency/handshake, ultra fast in serverless & Node)
      if (params.length === 0) {
        const rows = await this.sql(text);
        return { rows: Array.isArray(rows) ? rows : [] };
      }

      let formattedSql = text;
      params.forEach((param, index) => {
        const placeholder = new RegExp(`\\$${index + 1}\\b`, 'g');
        let val = param;
        if (val === null || val === undefined) {
          formattedSql = formattedSql.replace(placeholder, 'NULL');
        } else if (typeof val === 'number') {
          formattedSql = formattedSql.replace(placeholder, `${val}`);
        } else if (typeof val === 'boolean') {
          formattedSql = formattedSql.replace(placeholder, val ? 'TRUE' : 'FALSE');
        } else {
          const escaped = String(val).replace(/'/g, "''");
          formattedSql = formattedSql.replace(placeholder, `'${escaped}'`);
        }
      });

      const rows = await this.sql(formattedSql);
      return { rows: Array.isArray(rows) ? rows : [] };
    } catch (sqlErr: any) {
      console.error('Neon SQL execution error:', sqlErr);
      throw sqlErr;
    }
  }
}

// Global singleton
declare global {
  var _neonAdapter: NeonDatabaseAdapter | undefined;
}

export function getDatabasePool(): NeonDatabaseAdapter | null {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!databaseUrl || databaseUrl.includes('sample-123456') || databaseUrl.includes('db.example.com')) {
    return null;
  }

  if (!global._neonAdapter) {
    global._neonAdapter = new NeonDatabaseAdapter(databaseUrl);
  }

  return global._neonAdapter;
}

export const db = {
  async query(text: string, params: any[] = []): Promise<{ rows: any[] }> {
    const pool = getDatabasePool();
    if (pool) {
      return pool.query(text, params);
    }
    // Return empty fallback if not connected
    return { rows: [] };
  },
};

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

export async function initPostgresSchema(dbPool: any): Promise<void> {
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

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_pwd_reset_email_code ON password_reset_tokens(email, code);
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
    for (const cat of defaultCats) {
      await pool.query(
        'INSERT INTO categories (id, user_id, name, icon, type) VALUES ($1, $2, $3, $4, $5)',
        [cat.id, userId, cat.name, cat.icon, cat.type]
      );
    }
  } else {
    memoryStore.categories.push(...defaultCats);
  }
}
