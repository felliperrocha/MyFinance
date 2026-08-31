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

async function runLoginTest() {
  console.log('Testando Login com usuário existente...');
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

  console.log('Login Status:', loginRes.status, loginRes.data);
  const cookie = loginRes.cookie ? loginRes.cookie[0].split(';')[0] : '';
  
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Cookie: cookie },
  });

  console.log('Usuário Logado:', meRes.data);
}

runLoginTest().catch(console.error);
