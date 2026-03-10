const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const SECRET = process.env.WEBHOOK_SECRET || '';

function verify(body, secret, sig) {
  const expected = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(body)).digest('hex');
  return expected === sig;
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/webhook', (req, res) => {
  if (SECRET && !verify(req.body, SECRET, req.headers['x-join39-signature'])) {
    return res.status(401).send('Invalid signature');
  }

  const { eventId, eventType, timestamp, username, data } = req.body;
  console.log(`[${timestamp}] ${eventType} from ${username} (${eventId})`);
  console.log('  Data:', JSON.stringify(data));

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Echo service listening on port ${PORT}`));
