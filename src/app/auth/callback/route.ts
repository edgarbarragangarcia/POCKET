import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    error,
    errorDescription,
    fullUrl: request.url
  })

  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    // Redirect to login with error
    return NextResponse.redirect(`${requestUrl.origin}/login?error=${error}&error_description=${errorDescription}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=exchange_failed&error_description=${exchangeError.message}`)
      }

      console.log('Successfully exchanged code for session:', {
        userId: data.user?.id,
        email: data.user?.email
      })

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/campaigns`)
      
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`)
    }
  }

  // No code and no error - redirect to login
  console.warn('Auth callback received without code or error')
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
