import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export async function GET() {
  const logger = createLogger('TestWebhook');
  try {
    logger.info('=== WEBHOOK CONNECTIVITY TEST ===');
    
    const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas';
    logger.info('Testing webhook URL', { webhookUrl });
    
    // Simple test payload
    const testData = {
      test: true,
      message: 'Connectivity test from campaign manager',
      timestamp: new Date().toISOString(),
      source: 'webhook-test-endpoint'
    };
    
    logger.info('Sending test data', { testData });
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Campaign-Manager-Test/1.0',
      },
      body: JSON.stringify(testData),
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });
    
    logger.info('Test response', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const responseText = await response.text();
    logger.info('Test response body', { body: responseText });
    
    const result = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      url: webhookUrl,
      timestamp: new Date().toISOString()
    };
    
    logger.info('=== TEST RESULT ===');
    logger.info('Test result', result);
    logger.info('=== WEBHOOK CONNECTIVITY TEST END ===');
    
    return NextResponse.json(result);
    
  } catch (error) {
    logger.error('=== WEBHOOK TEST ERROR ===');
    logger.error('Webhook test error', {
      errorType: error?.constructor?.name,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    const result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString()
    };
    
    logger.error('=== WEBHOOK TEST ERROR END ===');
    
    return NextResponse.json(result, { status: 500 });
  }
}
