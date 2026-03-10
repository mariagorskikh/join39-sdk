const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const SECRET = process.env.WEBHOOK_SECRET || '';
const COST_PER_INVOCATION = 0.001; // $0.001 per invocation
const COST_PER_TOOL_CALL = 0.0005; // $0.0005 per tool call

// In-memory billing ledger (per username)
const ledger = {};

function verify(body, secret, sig) {
  const expected = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(body)).digest('hex');
  return expected === sig;
}

function charge(username, amount, reason) {
  if (!ledger[username]) {
    ledger[username] = { total: 0, transactions: [] };
  }
  ledger[username].total += amount;
  ledger[username].transactions.push({
    amount,
    reason,
    timestamp: new Date().toISOString(),
  });
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/billing', (_req, res) => res.json({ ledger }));

app.get('/billing/:username', (req, res) => {
  const entry = ledger[req.params.username];
  if (!entry) return res.json({ total: 0, transactions: [] });
  res.json(entry);
});

app.post('/webhook', (req, res) => {
  if (SECRET && !verify(req.body, SECRET, req.headers['x-join39-signature'])) {
    return res.status(401).send('Invalid signature');
  }

  const { eventType, username, data } = req.body;

  if (eventType === 'agent.invocation.complete') {
    charge(username, COST_PER_INVOCATION, 'invocation');
    const toolCount = (data.toolCalls || []).length;
    if (toolCount > 0) {
      charge(username, COST_PER_TOOL_CALL * toolCount, `${toolCount} tool calls`);
    }
    console.log(`[BILLING] ${username}: $${ledger[username].total.toFixed(4)}`);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Payment mock listening on port ${PORT}`));
