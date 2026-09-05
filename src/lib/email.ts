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
    const transporter = isGmail
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })
      : nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `Seu código de segurança MyFinance: ${code}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[EMAIL] Successfully sent real email to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId, provider: 'smtp' };
  }

  // 2. Resend API key support if present
  if (process.env.RESEND_API_KEY) {
    const fromAddress = process.env.EMAIL_FROM || 'MyFinance <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject: `Seu código de segurança MyFinance: ${code}`,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[EMAIL RESEND ERROR]', data);
      if (data?.message?.includes('testing emails to your own email address')) {
        throw new Error('No modo de teste inicial do Resend, envie para o e-mail cadastrado na sua conta. Para liberar para qualquer destinatário público, conecte um domínio em resend.com/domains.');
      }
      throw new Error(data?.message || 'Falha ao disparar e-mail via Resend.');
    }

    console.log(`[EMAIL] Sent via Resend to ${to}:`, data);
    return { success: true, resendId: data.id, provider: 'resend' };
  }

  // 3. Fallback: Ethereal test inbox or development logger
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
