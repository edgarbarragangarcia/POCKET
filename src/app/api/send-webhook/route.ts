import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export async function POST(request: Request) {
  const logger = createLogger('WebhookProxy');
  logger.info('Webhook proxy received request');
  const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/creadorCampañas';

  try {
        const body = await request.json();
    logger.debug('Webhook proxy request body', body);

        logger.info('Forwarding to n8n', { webhookUrl });
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Si n8n devuelve un error, lo reenviamos al cliente
            const errorBody = await response.text();
      logger.error('Error from n8n', { status: response.status, statusText: response.statusText, error: errorBody });
      return new NextResponse(`Error from n8n: ${response.statusText} - ${errorBody}`,
        { status: response.status }
      );
    }

    // Si todo va bien, devolvemos una respuesta exitosa
        logger.info('Successfully sent to n8n');
    return NextResponse.json({ message: 'Flow sent successfully to n8n' });

  } catch (error: any) {
    logger.error('Error in webhook proxy', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
