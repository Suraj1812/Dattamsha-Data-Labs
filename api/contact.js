const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@dataproducts.co.in';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

function sanitize(value, max = 2000) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function validatePayload(body) {
  const name = sanitize(body?.name, 120);
  const email = sanitize(body?.email, 180);
  const company = sanitize(body?.company, 180);
  const message = sanitize(body?.message, 4000);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }
  if (!emailPattern.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  return { name, email, company, message };
}

async function sendViaResend({ name, email, company, message }) {
  const subject = `New website inquiry from ${name}`;
  const companyText = company || 'Not provided';
  const text = [
    'New contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${companyText}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${companyText}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br/>')}</p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Resend API HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    if (!RESEND_API_KEY) {
      return res.status(500).json({
        error: 'RESEND_API_KEY is not configured on the server.',
      });
    }

    const payload = validatePayload(req.body);
    if ('error' in payload) {
      return res.status(400).json({ error: payload.error });
    }

    await sendViaResend(payload);
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send message right now.';
    const status = error?.status || 500;
    return res.status(status).json({ error: message });
  }
}
