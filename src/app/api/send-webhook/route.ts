import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('[Webhook Proxy] Received request');
  const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook/creadorCampañas';

  try {
        const body = await request.json();
    console.log('[Webhook Proxy] Request Body:', JSON.stringify(body, null, 2));

        console.log(`[Webhook Proxy] Forwarding to n8n at ${webhookUrl}`);
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
      console.error(`[Webhook Proxy] Error from n8n: ${response.status} ${response.statusText}`, errorBody);
      return new NextResponse(`Error from n8n: ${response.statusText} - ${errorBody}`,
        { status: response.status }
      );
    }

    // Si todo va bien, devolvemos una respuesta exitosa
        console.log('[Webhook Proxy] Successfully sent to n8n');
    return NextResponse.json({ message: 'Flow sent successfully to n8n' });

  } catch (error: any) {
    console.error('Error in webhook proxy:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
