import { NextRequest, NextResponse } from 'next/server';
import { db, seedUserDefaultCategories } from '@/lib/db';
import { signToken, setAuthCookie, hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { credential, email, name } = body;

    // 1. If Google ID Token is provided, verify it directly with Google
    if (credential) {
      try {
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!googleRes.ok) {
          const errData = await googleRes.json().catch(() => ({}));
          console.error('Google tokeninfo verification failed:', errData);
          return NextResponse.json(
            { error: 'Token do Google inválido ou expirado. Tente novamente.' },
            { status: 401 }
          );
        }

        const tokenInfo = await googleRes.json();
        email = tokenInfo.email;
        name = tokenInfo.name || tokenInfo.given_name || 'Usuário Google';
      } catch (tokenErr) {
        console.error('Error contacting Google tokeninfo service:', tokenErr);
        return NextResponse.json(
          { error: 'Não foi possível validar o token junto aos servidores do Google.' },
          { status: 502 }
        );
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Nenhuma credencial do Google foi recebida. Por favor, selecione sua conta Google.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || 'Usuário Google';

    // 2. Check if user exists in database
    let userRes = await db.query('SELECT id, name, email, currency, month_start_day, created_at FROM users WHERE email = $1', [normalizedEmail]);
    let user = userRes.rows[0];

    // 3. Create user if not found
    if (!user) {
      const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const defaultPasswordHash = await hashPassword(crypto.randomBytes(16).toString('hex'));
      const now = new Date().toISOString();

      await db.query(
        `INSERT INTO users (id, name, email, password_hash, currency, month_start_day, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'BRL', 1, $5, $6)`,
        [userId, displayName, normalizedEmail, defaultPasswordHash, now, now]
      );

      user = {
        id: userId,
        name: displayName,
        email: normalizedEmail,
        currency: 'BRL',
        month_start_day: 1,
        created_at: now,
      };

      // Seed default categories for the new Google user
      try {
        await seedUserDefaultCategories(userId);
      } catch (seedErr) {
        console.warn('Warning: could not seed default categories for Google user:', seedErr);
      }
    }

    // 4. Issue secure JWT token & session cookie
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
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
  } catch (error: any) {
    console.error('Google Auth unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao autenticar com o Google. Tente novamente.' },
      { status: 500 }
    );
  }
}
