import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const logger = createLogger('SendWebhook');
  let webhookData: any;
  
  try {
    const body = await request.json();
    
    // Add timestamp and additional metadata
    webhookData = {
      ...body,
      timestamp: new Date().toISOString(),
      source: 'campaign-manager',
      version: '1.0',
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    logger.info('=== WEBHOOK DEBUG START ===');
    logger.info('Request received at', new Date().toISOString());
    logger.info('Webhook URL', 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas');
    logger.info('Data to send', JSON.stringify(webhookData, null, 2));
    logger.info('Data size', `${JSON.stringify(webhookData).length} bytes`);

    // Try multiple approaches to ensure delivery
    const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas';
    
    // First attempt with standard fetch
    logger.info('Attempting webhook delivery...');
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Campaign-Manager/1.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(webhookData),
      // Add timeout
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    };

    logger.info('Fetch options:', JSON.stringify(fetchOptions, null, 2));

    const webhookResponse = await fetch(webhookUrl, fetchOptions);

    logger.info('Webhook response details', { status: webhookResponse.status, headers: Object.fromEntries(webhookResponse.headers.entries()) });

    // Read response regardless of status
    let responseData: string;
    try {
      responseData = await webhookResponse.text();
      logger.info('Webhook response body:', responseData);
    } catch (readError) {
      logger.error('Error reading webhook response', readError);
      responseData = 'Could not read response body';
    }

    if (!webhookResponse.ok) {
      logger.error('Webhook returned non-OK status', { status: webhookResponse.status, statusText: webhookResponse.statusText });
      
      // Try alternative approach - maybe the webhook expects different format
      logger.info('Trying alternative webhook format...');
      
      const alternativeData = {
        event: 'campaign_created',
        data: webhookData,
        meta: {
          timestamp: new Date().toISOString(),
          source: 'campaign-manager'
        }
      };
      
      const alternativeResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Campaign-Manager/1.0',
        },
        body: JSON.stringify(alternativeData),
      });
      
      logger.info('Alternative attempt status', { status: alternativeResponse.status });
      const altResponseData = await alternativeResponse.text();
      logger.info('Alternative response:', altResponseData);
      
      if (alternativeResponse.ok) {
        logger.info('Alternative format succeeded!');
        return NextResponse.json({ 
          success: true, 
          message: 'Data sent successfully to webhook (alternative format)',
          webhookResponse: altResponseData,
          method: 'alternative'
        });
      }
      
      throw new Error(`Webhook responded with status: ${webhookResponse.status} - ${responseData}`);
    }

    logger.info('Webhook delivery successful!');
    logger.info('=== WEBHOOK DEBUG END ===');

    return NextResponse.json({ 
      success: true, 
      message: 'Data sent successfully to webhook',
      webhookResponse: responseData,
      method: 'standard',
      requestId: webhookData.requestId
    });

  } catch (error) {
    logger.error('=== WEBHOOK ERROR ===');
    logger.error('Webhook error details', { type: error?.constructor?.name, message: error instanceof Error ? error.message : 'Unknown error', stack: error instanceof Error ? error.stack : 'No stack trace' });
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error('This appears to be a network connectivity issue');
    }
    
    logger.error('Data that failed to send:', webhookData ? JSON.stringify(webhookData, null, 2) : 'No data available');
    logger.error('=== WEBHOOK ERROR END ===');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send data to webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
