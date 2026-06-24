import express from 'express';
import dotenv from 'dotenv';
import { handleMessage } from './bot';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Twilio webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const from = req.body.From;
    const body = req.body.Body;

    if (!from || !body) {
      res.status(400).send('Missing required fields');
      return;
    }

    console.log(`[Webhook] Message from ${from}: ${body}`);

    // Send immediate response
    res.status(200).send('OK');

    // Process message asynchronously
    handleMessage(from, body).catch(err => {
      console.error('[Webhook] Error processing message:', err);
    });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    res.status(500).send('Internal server error');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Credit Comeback bot running on port ${PORT}`);
  console.log(`[Server] Webhook URL: http://localhost:${PORT}/webhook`);
});
