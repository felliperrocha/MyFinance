import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, comparePassword, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Não autorizado. Por favor faça login.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'A confirmação de senha não confere com a nova senha.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    // Fetch user current password hash
    const userRes = await db.query('SELECT id, password_hash FROM users WHERE id = $1', [authUser.userId]);
    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    // If user has a password_hash, verify it
    if (user.password_hash) {
      const isMatch = await comparePassword(currentPassword, user.password_hash);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'A senha atual informada está incorreta.' },
          { status: 400 }
        );
      }
    }

    // Update password
    const newHash = await hashPassword(newPassword);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, authUser.userId]
    );

    return NextResponse.json({
      message: 'Senha alterada com sucesso!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar a senha. Tente novamente.' },
      { status: 500 }
    );
  }
}
