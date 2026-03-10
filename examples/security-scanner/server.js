const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const SECRET = process.env.WEBHOOK_SECRET || '';

// Simple blocklist of suspicious tool patterns
const SUSPICIOUS_PATTERNS = [
  'http_request',  // external HTTP calls
  'exec',          // code execution
  'shell',         // shell access
];

const alerts = [];

function verify(body, secret, sig) {
  const expected = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(body)).digest('hex');
  return expected === sig;
}

app.get('/health', (_req, res) => res.json({ status: 'ok', alerts: alerts.length }));

app.get('/alerts', (_req, res) => res.json({ alerts: alerts.slice(-50) }));

app.post('/webhook', (req, res) => {
  if (SECRET && !verify(req.body, SECRET, req.headers['x-join39-signature'])) {
    return res.status(401).send('Invalid signature');
  }

  const { eventType, timestamp, username, data } = req.body;

  if (eventType === 'agent.tool.called') {
    const toolName = data.toolName || '';
    const isSuspicious = SUSPICIOUS_PATTERNS.some(p => toolName.includes(p));

    if (isSuspicious) {
      const alert = {
        timestamp,
        username,
        toolName,
        severity: 'warning',
        message: `Suspicious tool call: ${toolName}`,
      };
      alerts.push(alert);
      console.warn('[ALERT]', JSON.stringify(alert));
    } else {
      console.log(`[OK] ${username} called ${toolName}`);
    }
  }

  if (eventType === 'agent.invocation.error') {
    const alert = {
      timestamp,
      username,
      severity: 'error',
      message: `Agent error: ${data.error}`,
    };
    alerts.push(alert);
    console.error('[ALERT]', JSON.stringify(alert));
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Security scanner listening on port ${PORT}`));
