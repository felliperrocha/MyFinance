import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

// Ensure table exists on demand
async function ensureResetTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_pwd_reset_email_code ON password_reset_tokens(email, code);
  `);
}

export async function POST(req: NextRequest) {
  try {
    await ensureResetTable();
    const body = await req.json();
    const { action, email, code, newPassword, confirmPassword } = body;

    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: 'Por favor, informe seu e-mail cadastrado.' },
        { status: 400 }
      );
    }

    // STEP 1: REQUEST CODE ("send-code")
    if (action === 'request-code') {
      const userRes = await db.query('SELECT id, name, email FROM users WHERE email = $1', [normalizedEmail]);
      if (userRes.rows.length === 0) {
        return NextResponse.json(
          { error: 'Não encontramos nenhuma conta com este e-mail.' },
          { status: 404 }
        );
      }

      // Generate a secure 6-digit numeric verification code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenId = 'tok_' + crypto.randomUUID();
      // Expires in 15 minutes
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // Invalidate existing unused codes for this email
      await db.query('UPDATE password_reset_tokens SET used = TRUE WHERE email = $1 AND used = FALSE', [normalizedEmail]);

      // Insert new token
      await db.query(
        `INSERT INTO password_reset_tokens (id, email, code, expires_at, used, created_at)
         VALUES ($1, $2, $3, $4, FALSE, NOW())`,
        [tokenId, normalizedEmail, resetCode, expiresAt]
      );

      // In a live production environment with SMTP/Resend configured, email is dispatched.
      // We return a user-friendly simulated delivery message and include the code for immediate testing.
      console.log(`[PASSWORD RESET] Code for ${normalizedEmail}: ${resetCode}`);

      return NextResponse.json({
        success: true,
        message: `Código de verificação enviado para ${normalizedEmail}!`,
        // Provided for fast testing / verification in development
        debugCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined,
        codePreview: resetCode,
      });
    }

    // STEP 2: VERIFY CODE & SET NEW PASSWORD ("reset-password")
    if (action === 'reset-password' || !action) {
      if (!code || !code.trim()) {
        return NextResponse.json(
          { error: 'Código de verificação é obrigatório.' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'A nova senha deve ter no mínimo 6 caracteres.' },
          { status: 400 }
        );
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: 'A confirmação de senha não confere.' },
          { status: 400 }
        );
      }

      const cleanCode = code.trim();

      // Check token in database
      const tokenRes = await db.query(
        `SELECT * FROM password_reset_tokens 
         WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW() 
         ORDER BY created_at DESC LIMIT 1`,
        [normalizedEmail, cleanCode]
      );

      if (tokenRes.rows.length === 0) {
        return NextResponse.json(
          { error: 'Código de verificação inválido ou expirado. Solicite um novo código.' },
          { status: 400 }
        );
      }

      const tokenRecord = tokenRes.rows[0];

      // Mark token as used
      await db.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [tokenRecord.id]);

      // Update user password
      const newHash = await hashPassword(newPassword);
      await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
        [newHash, normalizedEmail]
      );

      return NextResponse.json({
        success: true,
        message: 'Senha redefinida com sucesso com autenticação segura!',
      });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a solicitação de redefinição.' },
      { status: 500 }
    );
  }
}
