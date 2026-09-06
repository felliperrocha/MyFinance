import nodemailer from 'nodemailer';

interface SendResetEmailParams {
  to: string;
  code: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ to, code, resetUrl }: SendResetEmailParams) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"MyFinance" <${smtpUser}>` : '"MyFinance" <noreply@myfinance.com>');

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Recuperação de Senha — MyFinance</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #27272a;">
        <div style="display: inline-flex; align-items: center; gap: 8px; justify-content: center;">
          <div style="width: 28px; height: 28px; background-color: #ffffff; border-radius: 6px; display: inline-block; vertical-align: middle; text-align: center; line-height: 28px; font-weight: bold; color: #000000; font-size: 16px;">M</div>
          <span style="font-size: 20px; font-weight: 700; color: #ffffff; vertical-align: middle; letter-spacing: -0.5px; margin-left: 8px;">MyFinance</span>
        </div>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #ffffff; text-align: center;">Recuperação de Senha</h2>
        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #a1a1aa; text-align: center;">
          Você solicitou a redefinição de senha para a sua conta associada ao e-mail <strong style="color: #ffffff;">${to}</strong>.
        </p>

        <!-- Code Card -->
        <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
          <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; font-weight: 600;">Seu Código de Verificação</p>
          <div style="font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #ffffff; font-family: 'Courier New', Courier, monospace; margin: 4px 0;">
            ${code}
          </div>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #71717a;">Válido pelos próximos 15 minutos.</p>
        </div>

        <!-- Direct Link Button -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${resetUrl}" style="background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block;">
            Redefinir Senha Diretamente
          </a>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #71717a;">Ou clique no botão acima para abrir a página já com o código preenchido.</p>
        </div>

        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a; text-align: center;">
          Se você não fez essa solicitação, por favor ignore esta mensagem. Sua conta permanece segura.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #0d0d10; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #52525b;">
        MyFinance — Gestão Financeira Inteligente
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Recuperação de Senha — MyFinance

Você solicitou a redefinição de senha para a conta ${to}.
Seu código de verificação é: ${code}

Válido por 15 minutos.

Para redefinir diretamente pelo navegador, use o link:
${resetUrl}

Se você não solicitou esta alteração, ignore este e-mail.
  `;

  // 1. Real SMTP transport (Gmail, Outlook, Brevo, custom SMTP)
  if (smtpUser && smtpPass) {
    const isGmail = smtpHost.includes('gmail');
    const cleanPass = smtpPass.replace(/\s+/g, '');
    const cleanFrom = isGmail ? `"MyFinance" <${smtpUser}>` : fromAddress;

    try {
      const transporter = isGmail
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: cleanPass,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          })
        : nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: cleanPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          });

      const info = await transporter.sendMail({
        from: cleanFrom,
        to,
        subject: `Seu código de segurança MyFinance: ${code}`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[EMAIL] Successfully sent real email to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (smtpErr: any) {
      console.error('[EMAIL ERROR] Falha no envio via SMTP real:', smtpErr.message);
      // If service: 'gmail' failed, try explicit host on port 587 with STARTTLS
      if (isGmail) {
        try {
          console.log('[EMAIL] Tentando fallback para smtp.gmail.com na porta 587 (TLS)...');
          const fallbackTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: smtpUser,
              pass: cleanPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          });

          const info = await fallbackTransporter.sendMail({
            from: cleanFrom,
            to,
            subject: `Seu código de segurança MyFinance: ${code}`,
            text: textContent,
            html: htmlContent,
          });

          console.log(`[EMAIL] Fallback 587 bem-sucedido para ${to}. MessageId: ${info.messageId}`);
          return { success: true, messageId: info.messageId, provider: 'smtp-fallback-587' };
        } catch (fbErr: any) {
          console.error('[EMAIL ERROR] Fallback 587 também falhou:', fbErr.message);
          throw new Error(`Falha ao autenticar no Gmail SMTP: ${smtpErr.message || fbErr.message}. Verifique se a "Senha de App" de 16 dígitos está correta e com Verificação em 2 Etapas ativada.`);
        }
      }
      throw smtpErr;
    }
  }

  // 2. Fallback: Ethereal test inbox or development logger (when SMTP is not configured yet)
  console.warn('[EMAIL WARNING] SMTP_USER ou SMTP_PASS não estão configurados no .env.local! O envio real para o Gmail está desativado.');
  console.log(`[EMAIL DEV CODE] Para o e-mail ${to}, o código gerado foi: ${code}`);

  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"MyFinance" <noreply@myfinance.com>',
      to,
      subject: `Seu código de segurança MyFinance: ${code}`,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[EMAIL TEST ETHEREAL] Sent to ${to}. Preview URL: ${previewUrl}`);

    return {
      success: true,
      provider: 'ethereal',
      previewUrl,
      needsSmtpConfig: true,
    };
  } catch (fallbackErr) {
    console.warn('[EMAIL] Fallback error, logging code to console:', fallbackErr);
    console.log(`[EMAIL BACKUP] To: ${to} | Code: ${code} | ResetURL: ${resetUrl}`);
    return { success: true, provider: 'console', needsSmtpConfig: true };
  }
}
