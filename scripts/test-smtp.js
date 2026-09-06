const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Carrega .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
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

async function diagnoseSMTP() {
  console.log('=== DIAGNÓSTICO DO GMAIL SMTP ===\n');

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

  console.log('1. Verificando Variáveis de Ambiente no .env.local:');
  console.log(`   - SMTP_USER: ${smtpUser ? smtpUser : '❌ NÃO DEFINIDO'}`);
  console.log(`   - SMTP_PASS: ${smtpPass ? '****** (definido com ' + smtpPass.length + ' caracteres)' : '❌ NÃO DEFINIDO'}`);
  console.log(`   - SMTP_HOST: ${smtpHost}`);
  console.log(`   - SMTP_PORT: ${smtpPort}`);

  if (!smtpUser || !smtpPass) {
    console.log('\n⚠️ MOTIVO DO NÃO ENVIO:');
    console.log('As variáveis SMTP_USER e/ou SMTP_PASS NÃO estão configuradas no seu arquivo .env.local!');
    console.log('Por conta disso, o sistema cai automaticamente no fallback do Ethereal (e-mail de teste virtual),');
    console.log('e NENHUM e-mail real é enviado para a sua caixa de entrada do Gmail.\n');
    console.log('Para corrigir:');
    console.log('1. Gere uma Senha de App no Google: https://myaccount.google.com/apppasswords');
    console.log('2. Adicione ao .env.local:');
    console.log('   SMTP_USER="seu-email@gmail.com"');
    console.log('   SMTP_PASS="senha-de-app-16-letras"');
    return;
  }

  console.log('\n2. Testando autenticação direta com o servidor Gmail...');
  const cleanPass = smtpPass.replace(/\s+/g, '');
  
  // Teste 1: service: 'gmail'
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: cleanPass,
      },
    });

    await transporter.verify();
    console.log('✅ Sucesso! Conexão e autenticação com o Gmail foram aceitas!');
  } catch (err) {
    console.error('❌ Falha na autenticação Gmail:', err.message);
    if (err.responseCode === 535 || err.message.includes('535')) {
      console.log('\n💡 DICA DE ERRO 535:');
      console.log('- O Gmail recusou a senha.');
      console.log('- Você NÃO deve usar sua senha normal do Google.');
      console.log('- Você DEVE usar uma "Senha de App" de 16 letras gerada em: https://myaccount.google.com/apppasswords');
      console.log('- Certifique-se de que a Verificação em 2 Etapas está ativada na sua conta Google.');
    }
  }
}

diagnoseSMTP().catch(console.error);
