import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';

export async function GET() {
  try {
    const pool = getDatabasePool();
    const isNeonConnected = pool !== null;
    const user = memoryStore.users[0];

    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        currency: user.currency || 'BRL',
        month_start_day: user.month_start_day || 1,
      },
      database: {
        type: isNeonConnected ? 'Neon PostgreSQL' : 'Armazenamento Local Resiliente (Memória/Cache)',
        status: isNeonConnected ? 'connected' : 'local_ready',
        host: isNeonConnected ? 'Neon Cloud AWS' : 'Local Standalone',
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, currency, month_start_day } = body;

    const user = memoryStore.users[0];
    if (name) user.name = name;
    if (email) user.email = email;
    if (currency) user.currency = currency;
    if (month_start_day) user.month_start_day = parseInt(month_start_day, 10);

    const pool = getDatabasePool();
    if (pool) {
      await pool.query(
        'UPDATE users SET name = $1, email = $2, currency = $3, month_start_day = $4, updated_at = NOW() WHERE id = $5',
        [user.name, user.email, user.currency, user.month_start_day, user.id]
      );
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
