const configuredModels = (process.env.GEMINI_MODELS || 'gemini-2.5-pro,gemini-2.5-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const configuredApiKeys = (
  process.env.GEMINI_API_KEYS ||
  process.env.GEMINI_API_KEY ||
  ''
)
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);

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
  throw finalError;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';
    if (!command) {
      return res.status(400).json({ error: 'Command is required.' });
    }

    if (configuredApiKeys.length === 0) {
      return res.status(500).json({ error: 'GEMINI_API_KEY / GEMINI_API_KEYS is not configured.' });
    }

    const { response, model } = await callGeminiWithFallback(command);
    return res.status(200).json({ response, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    const status = error?.status || 500;
    return res.status(status).json({ error: message });
  }
}

