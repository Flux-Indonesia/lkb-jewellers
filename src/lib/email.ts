import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"LKB Jewellers" <${process.env.SMTP_USER || "noreply@lkbjewellers.com"}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "noreply@lkbjewellers.com";

/** Escape HTML to prevent XSS in email templates */
function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding:40px 32px 32px;border-bottom:1px solid #333;">
              <img src="https://www.lkbjewellers.com/white-logo.png" alt="LKB Jewellers" width="50" height="50" style="display:block;margin:0 auto 8px;" />
              <p style="color:#888;font-size:10px;letter-spacing:3px;margin:0;text-transform:uppercase;">Jewellers · Hatton Garden</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #333;padding:24px 32px;text-align:center;">
              <p style="color:#666;font-size:11px;margin:0 0 6px;">New House, 67-68 Hatton Garden, London, EC1N 8JY</p>
              <p style="color:#666;font-size:11px;margin:0;">+44 20 3336 5303 · info@lkbjewellers.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Customer emails ────────────────────────────────────────────────────────

export async function sendContactConfirmation(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "We've received your message — LKB Jewellers",
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">Thank you, ${esc(name)}</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 16px;text-align:center;">
        We've received your message and will get back to you within 24 hours.
      </p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        If your enquiry is urgent, please call us on <strong style="color:#fff;">+44 20 3336 5303</strong> or WhatsApp <strong style="color:#fff;">+44 78 0232 3652</strong>.
      </p>
    `),
  });
}

export async function sendEnquiryConfirmation(to: string, name: string, productName: string, productPrice: number) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Enquiry received: ${productName} — LKB Jewellers`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">Enquiry Received</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 16px;text-align:center;">
        Hi ${esc(name)}, thank you for your interest in <strong style="color:#fff;">${esc(productName)}</strong> (£${productPrice.toLocaleString()}).
      </p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        One of our specialists will be in touch shortly via your preferred contact method.
      </p>
    `),
  });
}

export async function sendSellSubmissionConfirmation(to: string, name: string, brand: string, model: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "We're reviewing your submission — LKB Jewellers",
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">Submission Received</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 16px;text-align:center;">
        Hi ${esc(name)}, we've received your submission for your <strong style="color:#fff;">${esc(brand)} ${esc(model)}</strong>.
      </p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        Our team will review the details and come back to you with a valuation as soon as possible.
      </p>
    `),
  });
}

export async function sendNewsletterWelcome(to: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Welcome to LKB Jewellers",
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">You're In</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 16px;text-align:center;">
        Thank you for subscribing to the LKB Jewellers newsletter.
      </p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        You'll be the first to know about new arrivals, exclusive drops, and special offers.
      </p>
    `),
  });
}

export async function sendOrderConfirmation(
  to: string,
  name: string,
  orderId: string,
  amount: number,
  currency: string,
  items: { name: string; price: number; quantity: number }[]
) {
  const symbol = currency === "gbp" ? "£" : currency.toUpperCase() + " ";
  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="color:#ccc;font-size:13px;padding:8px 0;border-bottom:1px solid #222;">${esc(i.name)}</td>
          <td style="color:#ccc;font-size:13px;padding:8px 0;border-bottom:1px solid #222;text-align:center;">${i.quantity}</td>
          <td style="color:#fff;font-size:13px;padding:8px 0;border-bottom:1px solid #222;text-align:right;">${symbol}${i.price.toLocaleString()}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Order confirmed — LKB Jewellers`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">Order Confirmed</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">
        Hi ${esc(name)}, thank you for your purchase. Your order has been confirmed.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr>
          <th style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:0 0 8px;text-align:left;border-bottom:1px solid #333;">Item</th>
          <th style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:0 0 8px;text-align:center;border-bottom:1px solid #333;">Qty</th>
          <th style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:0 0 8px;text-align:right;border-bottom:1px solid #333;">Price</th>
        </tr>
        ${itemRows}
      </table>
      <div style="text-align:right;margin:0 0 24px;">
        <p style="color:#999;font-size:12px;margin:0 0 4px;">Total</p>
        <p style="color:#fff;font-size:24px;font-weight:bold;margin:0;">${symbol}${amount.toLocaleString()}</p>
      </div>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        We'll send you an update once your order is on its way. If you have any questions, don't hesitate to reach out.
      </p>
    `),
  });
}

export async function sendSignupWelcome(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Welcome to LKB Jewellers",
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">Welcome, ${esc(name || "there")}</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 16px;text-align:center;">
        Your LKB Jewellers account has been created successfully.
      </p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">
        You can now save favourites, track orders, and enjoy a seamless shopping experience.
      </p>
      <a href="https://www.lkbjewellers.com/shop" style="display:inline-block;background:#fff;color:#000;padding:12px 32px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:2px;">BROWSE COLLECTION</a>
    `),
  });
}

// ─── Admin notification emails ──────────────────────────────────────────────

export async function notifyAdminContact(name: string, email: string, interest: string, message: string) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New contact: ${name} — ${interest}`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">New Contact Inquiry</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;font-size:13px;padding:6px 0;width:100px;">Name</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(name)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Email</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(email)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Interest</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(interest)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;vertical-align:top;">Message</td><td style="color:#ccc;font-size:13px;padding:6px 0;">${esc(message)}</td></tr>
      </table>
    `),
  });
}

export async function notifyAdminEnquiry(name: string, email: string, productName: string, productPrice: number) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New enquiry: ${productName} — ${name}`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">New Product Enquiry</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;font-size:13px;padding:6px 0;width:100px;">Customer</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(name)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Email</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(email)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Product</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(productName)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Price</td><td style="color:#fff;font-size:13px;padding:6px 0;">£${productPrice.toLocaleString()}</td></tr>
      </table>
    `),
  });
}

export async function notifyAdminSellSubmission(name: string, email: string, brand: string, model: string) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New sell submission: ${brand} ${model} — ${name}`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">New Sell Submission</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;font-size:13px;padding:6px 0;width:100px;">Customer</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(name)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Email</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(email)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Brand</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(brand)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Model</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(model)}</td></tr>
      </table>
    `),
  });
}

export async function notifyAdminOrder(name: string, email: string, amount: number, currency: string) {
  const symbol = currency === "gbp" ? "£" : currency.toUpperCase() + " ";
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New order: ${symbol}${amount.toLocaleString()} — ${name}`,
    html: baseLayout(`
      <h1 style="color:#fff;font-size:22px;margin:0 0 16px;text-align:center;">New Order Received</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;font-size:13px;padding:6px 0;width:100px;">Customer</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(name)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Email</td><td style="color:#fff;font-size:13px;padding:6px 0;">${esc(email)}</td></tr>
        <tr><td style="color:#999;font-size:13px;padding:6px 0;">Amount</td><td style="color:#fff;font-size:24px;font-weight:bold;padding:6px 0;">${symbol}${amount.toLocaleString()}</td></tr>
      </table>
    `),
  });
}
