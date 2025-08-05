import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== WEBHOOK CONNECTIVITY TEST ===');
    
    const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas';
    console.log('Testing webhook URL:', webhookUrl);
    
    // Simple test payload
    const testData = {
      test: true,
      message: 'Connectivity test from campaign manager',
      timestamp: new Date().toISOString(),
      source: 'webhook-test-endpoint'
    };
    
    console.log('Sending test data:', testData);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Campaign-Manager-Test/1.0',
      },
      body: JSON.stringify(testData),
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });
    
    console.log('Test response status:', response.status);
    console.log('Test response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Test response body:', responseText);
    
    const result = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      url: webhookUrl,
      timestamp: new Date().toISOString()
    };
    
    console.log('=== TEST RESULT ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('=== WEBHOOK CONNECTIVITY TEST END ===');
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('=== WEBHOOK TEST ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString()
    };
    
    console.log('=== WEBHOOK TEST ERROR END ===');
    
    return NextResponse.json(result, { status: 500 });
  }
}
