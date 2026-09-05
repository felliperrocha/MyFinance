import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, setAuthCookie, hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, name, avatarUrl } = body;

    // Default mock user profile if clicked directly
    if (!email) {
      email = 'demo.google@myfinance.com';
      name = 'Usuário Google';
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || 'Usuário Google';

    // Check if user exists
    let userRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    let user = userRes.rows[0];

    if (!user) {
      const userId = 'usr_' + crypto.randomUUID();
      const defaultPasswordHash = await hashPassword(crypto.randomBytes(16).toString('hex'));

      const insertRes = await db.query(
        `INSERT INTO users (id, name, email, password_hash, currency, month_start_day, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'BRL', 1, NOW(), NOW())
         RETURNING id, name, email, currency, month_start_day, created_at`,
        [userId, displayName, normalizedEmail, defaultPasswordHash]
      );
      user = insertRes.rows[0];
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Login com Google efetuado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || 'BRL',
        month_start_day: user.month_start_day || 1,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Google Auth error:', error);
    return NextResponse.json(
      { error: 'Erro ao autenticar com o Google. Tente novamente.' },
      { status: 500 }
    );
  }
}
