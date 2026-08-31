import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDatabasePool, memoryStore } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    const pool = getDatabasePool();
    if (pool) {
      const res = await pool.query('SELECT id, name, email, currency, month_start_day FROM users WHERE id = $1', [authUser.userId]);
      if (res.rows.length > 0) {
        return NextResponse.json({ user: res.rows[0] });
      }
    } else {
      const user = memoryStore.users.find((u) => u.id === authUser.userId);
      if (user) {
        return NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            currency: user.currency || 'BRL',
            month_start_day: user.month_start_day || 1,
          },
        });
      }
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ user: null });
  }
}
