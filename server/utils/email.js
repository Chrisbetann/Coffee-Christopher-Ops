const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.SMTP_FROM || `Coffee Christopher <${process.env.SMTP_USER}>`;

function promoEmailHtml(customer, promo, discount) {
  const discountText = promo.type === 'percent_off'
    ? `${Number(promo.value)}% off`
    : `$${Number(promo.value).toFixed(2)} off`;

  const appliesToText = promo.applies_to === 'all'
    ? 'your entire order'
    : 'select menu items';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5ede0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:#5c3d2e;padding:32px 24px;text-align:center;">
      <p style="color:#f5ede0;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;">☕ Coffee Christopher</p>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">A special treat just for you</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 24px;">
      <p style="font-size:18px;font-weight:700;color:#2c1810;margin:0 0 8px;">Hey ${customer.name}! 👋</p>
      <p style="font-size:15px;color:#666;line-height:1.6;margin:0 0 24px;">
        We appreciate you being part of the Coffee Christopher family. Here's a special promotion just for you:
      </p>

      <!-- Promo box -->
      <div style="background:#f5ede0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="font-size:13px;color:#8b6347;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Promo Code</p>
        <p style="font-size:36px;font-weight:800;color:#5c3d2e;letter-spacing:4px;margin:0 0 8px;font-family:monospace;">${promo.code}</p>
        <p style="font-size:20px;font-weight:700;color:#2c1810;margin:0 0 4px;">${discountText} off ${appliesToText}</p>
        <p style="font-size:14px;color:#999;margin:0;">${promo.name}</p>
        ${promo.min_order_amount ? `<p style="font-size:13px;color:#b08060;margin:8px 0 0;">Min. order: $${Number(promo.min_order_amount).toFixed(2)}</p>` : ''}
        ${promo.expires_at ? `<p style="font-size:13px;color:#b08060;margin:4px 0 0;">Expires: ${new Date(promo.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>` : ''}
      </div>

      <p style="font-size:14px;color:#888;line-height:1.6;margin:0 0 24px;">
        Simply enter your promo code at checkout. See you soon!
      </p>

      <div style="text-align:center;">
        <p style="font-size:13px;color:#aaa;margin:0;">You're receiving this because you're a Coffee Christopher loyalty member.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9f4ef;padding:16px 24px;text-align:center;border-top:1px solid #ede0d4;">
      <p style="font-size:12px;color:#bbb;margin:0;">© ${new Date().getFullYear()} Coffee Christopher · All rights reserved</p>
    </div>
  </div>
</body>
</html>`;
}

function welcomeEmailHtml(customer) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5ede0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#5c3d2e;padding:32px 24px;text-align:center;">
      <p style="color:#f5ede0;font-size:28px;font-weight:800;margin:0;">☕ Coffee Christopher</p>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Welcome to the family!</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:20px;font-weight:700;color:#2c1810;margin:0 0 12px;">Welcome, ${customer.name}! 🎉</p>
      <p style="font-size:15px;color:#666;line-height:1.6;margin:0 0 24px;">
        You're now officially part of our loyalty program. Every dollar you spend earns you points toward future rewards.
      </p>
      <div style="background:#f5ede0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:14px;font-weight:700;color:#5c3d2e;margin:0 0 8px;">How it works:</p>
        <p style="font-size:14px;color:#666;margin:0 0 6px;">⭐ Earn 1 point for every $1 spent</p>
        <p style="font-size:14px;color:#666;margin:0 0 6px;">🏷️ Get exclusive promo codes sent to you</p>
        <p style="font-size:14px;color:#666;margin:0;">☕ Enjoy being a valued Coffee Christopher regular</p>
      </div>
      <p style="font-size:14px;color:#888;">Just enter your email at checkout to earn points on every order!</p>
    </div>
    <div style="background:#f9f4ef;padding:16px 24px;text-align:center;border-top:1px solid #ede0d4;">
      <p style="font-size:12px;color:#bbb;margin:0;">© ${new Date().getFullYear()} Coffee Christopher</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendWelcomeEmail(customer) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM,
    to: customer.email,
    subject: `Welcome to Coffee Christopher Rewards, ${customer.name}!`,
    html: welcomeEmailHtml(customer),
  });
}

async function sendPromoEmail(customer, promo) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email not configured. Set SMTP_USER and SMTP_PASS in your .env file.');
  }
  const transporter = createTransporter();
  const discountText = promo.type === 'percent_off'
    ? `${Number(promo.value)}% off`
    : `$${Number(promo.value).toFixed(2)} off`;

  await transporter.sendMail({
    from: FROM,
    to: customer.email,
    subject: `${discountText} just for you — ${promo.code} ☕`,
    html: promoEmailHtml(customer, promo),
  });
}

module.exports = { sendWelcomeEmail, sendPromoEmail };
