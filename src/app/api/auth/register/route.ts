import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore, seedUserDefaultCategories } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Por favor, preencha nome, e-mail e senha.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'A confirmação de senha não confere com a senha digitada.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const pool = getDatabasePool();

    // Check if user already exists
    if (pool) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado no sistema.' },
          { status: 400 }
        );
      }
    } else {
      const existing = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado no sistema.' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      password_hash: passwordHash,
      currency: 'BRL',
      month_start_day: 1,
      created_at: now,
      updated_at: now,
    };

    if (pool) {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, currency, month_start_day, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newUser.id, newUser.name, newUser.email, newUser.password_hash, newUser.currency, newUser.month_start_day, now, now]
      );
    } else {
      memoryStore.users.push(newUser);
    }

    // Create default categories for this user
    await seedUserDefaultCategories(userId);

    // Generate JWT token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          currency: newUser.currency,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar o cadastro. Tente novamente.' },
      { status: 500 }
    );
  }
}
