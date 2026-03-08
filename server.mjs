import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = Number(process.env.PORT || 8787);
const configuredApiKeys = (
  process.env.GEMINI_API_KEYS ||
  process.env.GEMINI_API_KEY ||
  ''
)
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);
const configuredModels = (process.env.GEMINI_MODELS || process.env.GEMINI_MODEL || 'gemini-2.5-pro,gemini-2.5-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@dataproducts.co.in';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(express.json({ limit: '1mb' }));

const SYSTEM_PROMPT =
  'You are Dattamsha Agent v2.0, an HR Workforce Intelligence AI for enterprise teams. ' +
  'Analyze workforce scenarios with focus on attrition risk, workforce engagement, hiring pipelines, productivity, and burnout risk. ' +
  'Return plain text only (no markdown, no **, no #, no bullet symbols). ' +
  'Use clear section labels in this order: Executive Summary, Findings, Key Drivers, Recommended Actions, KPI Tracking.';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function cleanMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*/g, '')
    .replace(/^[\s>*#-]+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function sanitize(value, max = 2000) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function validateContactPayload(body) {
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

async function sendContactMessage(payload) {
  const { name, email, company, message } = payload;
  const companyText = company || 'Not provided';
  const subject = `New website inquiry from ${name}`;
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

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.message || body?.error || `Resend API HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
}

function formatAgentResponse(rawText) {
  const compact = rawText.trim();
  const jsonCandidate = compact.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    const parsed = JSON.parse(jsonCandidate);
    const findings = String(parsed.findings || '').trim();
    const keyDrivers = String(parsed.key_drivers || '').trim();
    const actions = String(parsed.recommended_actions || '').trim();
    const kpis = String(parsed.kpi_tracking || '').trim();
    if (findings || keyDrivers || actions || kpis) {
      return [
        `Findings: ${findings || 'Not available.'}`,
        `Key Drivers: ${keyDrivers || 'Not available.'}`,
        `Recommended Actions: ${actions || 'Not available.'}`,
        `KPI Tracking: ${kpis || 'Not available.'}`,
      ].join('\n');
    }
  } catch {
    // Non-JSON fallback below.
  }

  const normalized = cleanMarkdown(compact);
  if (/^(Executive Summary:|Findings:|Key Drivers:|Recommended Actions:|KPI Tracking:)/i.test(normalized)) {
    return normalized;
  }
  return `Findings: ${normalized}`;
}

async function callGeminiWithModel(model, command, apiKey) {
  const longMode = /comprehensive|detailed|blueprint|roadmap|full plan|deep/i.test(command) || command.length > 220;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nHR challenge:\n${command}` }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.85,
      maxOutputTokens: longMode ? 2600 : 1100,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.error?.message || `Gemini API HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const text =
    body?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text)
      .filter(Boolean)
      .join('\n')
      .trim() || '';

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return formatAgentResponse(text);
}

async function callGeminiWithFallback(command) {
  const retryableStatus = new Set([429, 500, 502, 503, 504]);
  const errors = [];

  for (const apiKey of configuredApiKeys) {
    for (const model of configuredModels) {
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          const response = await callGeminiWithModel(model, command, apiKey);
          return { response, model };
        } catch (error) {
          const status = error?.status;
          const message = error instanceof Error ? error.message : 'Unknown Gemini error';
          errors.push({ model, attempt, status: status || null, message });

          if (!retryableStatus.has(status) || attempt === 2) {
            break;
          }
          await sleep(500 * attempt);
        }
      }
    }
  }

  const last = errors[errors.length - 1];
  const finalError = new Error(last?.message || 'Gemini request failed.');
  finalError.status = last?.status || 502;
  finalError.details = errors;
  throw finalError;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    apiConfigured: configuredApiKeys.length > 0,
    keyCount: configuredApiKeys.length,
    models: configuredModels,
  });
});

app.post('/api/agent', async (req, res) => {
  try {
    const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';
    if (!command) {
      return res.status(400).json({ error: 'Command is required.' });
    }

    if (configuredApiKeys.length === 0) {
      return res.status(500).json({ error: 'GEMINI_API_KEY / GEMINI_API_KEYS is not configured on the server.' });
    }

    const { response, model } = await callGeminiWithFallback(command);
    return res.json({ response, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    const status = error?.status || 500;
    return res.status(status).json({ error: message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured on the server.' });
    }

    const payload = validateContactPayload(req.body);
    if ('error' in payload) {
      return res.status(400).json({ error: payload.error });
    }

    await sendContactMessage(payload);
    return res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send message right now.';
    const status = error?.status || 500;
    return res.status(status).json({ error: message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
