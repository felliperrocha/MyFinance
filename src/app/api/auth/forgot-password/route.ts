import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, confirmPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'E-mail e nova senha são obrigatórios.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'A confirmação de senha não confere.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve conter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userRes = await db.query('SELECT id, name, email FROM users WHERE email = $1', [normalizedEmail]);
    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma conta encontrada com este e-mail.' },
        { status: 404 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
      [newHash, normalizedEmail]
    );

    return NextResponse.json({
      message: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao redefinir a senha. Tente novamente.' },
      { status: 500 }
    );
  }
}
