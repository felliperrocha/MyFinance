import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor, informe seu e-mail e senha.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const pool = getDatabasePool();
    let user: User | null = null;

    if (pool) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
      if (res.rows.length > 0) {
        user = res.rows[0];
      }
    } else {
      user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    }

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || 'BRL',
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Erro ao autenticar. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
