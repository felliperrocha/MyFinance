import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, memoryStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { DEFAULT_CATEGORIES } from '@/lib/seed';
import { Category } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    const userId = auth ? auth.userId : null;

    const pool = getDatabasePool();
    let categories: Category[] = [];

    if (userId) {
      if (pool) {
        const res = await pool.query('SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC', [userId]);
        categories = res.rows;
      } else {
        categories = memoryStore.categories.filter((c) => c.user_id === userId);
      }
    }

    if (categories.length === 0) {
      categories = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId || 'public' }));
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
    const userId = auth.userId;

    const body = await req.json();
    const { name, icon, type } = body;
    const pool = getDatabasePool();

    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      name: name || 'Nova Categoria',
      icon: icon || 'Tag',
      type: type || 'expense',
      created_at: new Date().toISOString(),
    };

    if (pool) {
      await pool.query(
        'INSERT INTO categories (id, user_id, name, icon, type) VALUES ($1, $2, $3, $4, $5)',
        [newCategory.id, userId, newCategory.name, newCategory.icon, newCategory.type]
      );
    } else {
      memoryStore.categories.push(newCategory);
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
