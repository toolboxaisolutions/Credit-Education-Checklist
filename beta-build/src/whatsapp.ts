import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !twilioWhatsappNumber) {
  console.warn('[WhatsApp] Missing Twilio credentials. Running in dry-run mode.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!client || !twilioWhatsappNumber) {
    console.log(`[WhatsApp] DRY RUN — to: ${to}\n${body}`);
    return true;
  }

  try {
    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsappNumber}`,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body,
    });
    console.log(`[WhatsApp] Sent ${message.sid} to ${to}`);
    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Send failed:', error.message);
    return false;
  }
}
