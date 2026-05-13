import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.ERCASPAY_WEBHOOK_SECRET || 'jix_webhook_secret_2024';
  const signature = req.headers['x-ercaspay-signature'];

  if (!signature) {
    return res.status(400).json({ message: 'Missing signature header' });
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  try {
    const event = req.body;

    // Handle the webhook event
    console.log('🔔 Webhook received:', event);

    // Example: Handle payment success
    if (event.eventType === 'payment.success') {
      console.log('✅ Payment successful:', event.data);
      // Process the payment success event
    }

    res.status(200).json({ message: 'Webhook handled successfully' });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}