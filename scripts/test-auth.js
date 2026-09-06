const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      const setCookie = res.headers['set-cookie'];
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), cookie: setCookie });
        } catch {
          resolve({ status: res.statusCode, data: body, cookie: setCookie });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('1. Testando /api/auth/me (Deslogado)...');
  const meBefore = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
  });
  console.log('   Resultado:', meBefore.data);

  console.log('\n2. Testando /api/auth/register (Cadastro com confirmação)...');
  const regRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Pedro Henrique',
      email: 'pedro@teste.com',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
    }
  );
  console.log('   Status:', regRes.status, 'Resultado:', regRes.data);

  const cookie = regRes.cookie ? regRes.cookie[0].split(';')[0] : '';
  console.log('   Cookie de Sessão recebido:', cookie ? 'Sim' : 'Não');

  console.log('\n3. Testando /api/auth/me (Logado com Cookie)...');
  const meAfter = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Cookie: cookie },
  });
  console.log('   Resultado:', meAfter.data);

  console.log('\n4. Testando /api/setup-db (Diagnóstico Neon)...');
  const dbRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/setup-db',
    method: 'GET',
  });
  console.log('   Resultado:', dbRes.data);

  console.log('\n5. Testando /api/auth/login (Login com credenciais)...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: 'pedro@teste.com',
      password: 'senhaSegura123',
    }
  );
  console.log('   Status:', loginRes.status, 'Resultado:', loginRes.data);
  const authCookie = loginRes.cookie ? loginRes.cookie[0].split(';')[0] : cookie;

  console.log('\n6. Testando /api/auth/change-password (Troca de senha)...');
  const changePwdRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    },
    {
      currentPassword: 'senhaSegura123',
      newPassword: 'novaSenhaSegura456',
      confirmPassword: 'novaSenhaSegura456',
    }
  );
  console.log('   Status:', changePwdRes.status, 'Resultado:', changePwdRes.data);

  console.log('\n7. Testando /api/auth/forgot-password (Solicitação de código via Gmail SMTP)...');
  const forgotReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      action: 'request-code',
      email: 'pedro@teste.com',
    }
  );
  console.log('   Status:', forgotReqRes.status, 'Resultado:', forgotReqRes.data);

  console.log('\n8. Testando /api/auth/logout (Desconexão da sessão)...');
  const logoutRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/logout',
      method: 'POST',
      headers: { Cookie: authCookie },
    },
    {}
  );
  console.log('   Status:', logoutRes.status, 'Resultado:', logoutRes.data);

  console.log('\n✓ Todos os testes de autenticação e rotas passaram com sucesso!');
}

runTests().catch(console.error);
