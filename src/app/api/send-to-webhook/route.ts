import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    console.log('=== WEBHOOK DEBUG START ===');
    console.log('Request received at:', new Date().toISOString());
    console.log('Webhook URL:', 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas');
    console.log('Data to send:', JSON.stringify(webhookData, null, 2));
    console.log('Data size:', JSON.stringify(webhookData).length, 'bytes');

    // Try multiple approaches to ensure delivery
    const webhookUrl = 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas';
    
    // First attempt with standard fetch
    console.log('Attempting webhook delivery...');
    
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

    console.log('Fetch options:', JSON.stringify(fetchOptions, null, 2));

    const webhookResponse = await fetch(webhookUrl, fetchOptions);

    console.log('Webhook response status:', webhookResponse.status);
    console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));

    // Read response regardless of status
    let responseData: string;
    try {
      responseData = await webhookResponse.text();
      console.log('Webhook response body:', responseData);
    } catch (readError) {
      console.error('Error reading webhook response:', readError);
      responseData = 'Could not read response body';
    }

    if (!webhookResponse.ok) {
      console.error('Webhook returned non-OK status:', webhookResponse.status, webhookResponse.statusText);
      
      // Try alternative approach - maybe the webhook expects different format
      console.log('Trying alternative webhook format...');
      
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
      
      console.log('Alternative attempt status:', alternativeResponse.status);
      const altResponseData = await alternativeResponse.text();
      console.log('Alternative response:', altResponseData);
      
      if (alternativeResponse.ok) {
        console.log('Alternative format succeeded!');
        return NextResponse.json({ 
          success: true, 
          message: 'Data sent successfully to webhook (alternative format)',
          webhookResponse: altResponseData,
          method: 'alternative'
        });
      }
      
      throw new Error(`Webhook responded with status: ${webhookResponse.status} - ${responseData}`);
    }

    console.log('Webhook delivery successful!');
    console.log('=== WEBHOOK DEBUG END ===');

    return NextResponse.json({ 
      success: true, 
      message: 'Data sent successfully to webhook',
      webhookResponse: responseData,
      method: 'standard',
      requestId: webhookData.requestId
    });

  } catch (error) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('This appears to be a network connectivity issue');
    }
    
    console.error('Data that failed to send:', webhookData ? JSON.stringify(webhookData, null, 2) : 'No data available');
    console.error('=== WEBHOOK ERROR END ===');
    
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
