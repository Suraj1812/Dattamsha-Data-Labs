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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(express.json({ limit: '1mb' }));

const SYSTEM_PROMPT =
  'You are Dattamsha Agent v2.0, an HR Workforce Intelligence AI for enterprise teams. ' +
  'Analyze workforce scenarios with focus on attrition risk, workforce engagement, hiring pipelines, productivity, and burnout risk. ' +
  'Return concise structured output with: Findings, Key Drivers, Recommended Actions, KPI Tracking.';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiWithModel(model, command, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nHR challenge:\n${command}` }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 700,
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

  return text;
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
