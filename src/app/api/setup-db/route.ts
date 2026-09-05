import { NextResponse } from 'next/server';
import { getDatabasePool, initPostgresSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = getDatabasePool();
    if (!pool) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'DATABASE_URL não configurada ou usando valor de exemplo. Adicione sua URL de conexão do Neon PostgreSQL no arquivo .env.local',
      });
    }

    await initPostgresSchema(pool);

    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    return NextResponse.json({
      success: true,
      connected: true,
      message: 'Todas as 8 tabelas do MyFinance foram criadas/verificadas com sucesso no Neon PostgreSQL!',
      tables: tablesRes.rows.map((r: any) => r.table_name),
    });
  } catch (error: any) {
    console.error('Error during database setup:', error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message || 'Erro ao conectar ou criar tabelas no Neon PostgreSQL',
      },
      { status: 500 }
    );
  }
}
