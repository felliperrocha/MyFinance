const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

neonConfig.webSocketConstructor = ws;

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const val = v.join('=').replace(/^["']|["']$/g, '');
      if (k && val && !process.env[k]) {
        process.env[k] = val;
      }
    }
  });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testIntegration() {
  console.log('1. Limpando usuários de teste antigos no Neon...');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM income');
  await pool.query('DELETE FROM expenses');
  await pool.query('DELETE FROM goals');
  await pool.query('DELETE FROM budgets');
  await pool.query('DELETE FROM strategies');
  await pool.query('DELETE FROM insights');
  console.log('✓ Banco de dados limpo e resetado com sucesso.');

  console.log('\n2. Criando novo usuário de teste no Neon...');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('123456', salt);
  const email = 'luiisffelipe.m.b.r@gmail.com';

  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, currency, month_start_day) VALUES ($1, $2, $3, $4, $5, $6)',
    ['usr-test-1', 'Fellipe Rocha', email, hash, 'BRL', 1]
  );
  console.log('✓ Usuário cadastrado no Neon:', email);

  console.log('\n3. Verificando login contra o Neon...');
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = res.rows[0];
  const isValid = await bcrypt.compare('123456', user.password_hash);
  console.log('✓ Senha válida comparada com bcrypt?', isValid ? 'SIM (100% OK)' : 'NÃO');

  await pool.end();
}

testIntegration().catch(console.error);
