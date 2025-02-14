//auth/callback/route

import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Dodajemy parametr z tokenem do URL
      const redirectUrl = new URL(next, origin)
      redirectUrl.searchParams.set('access_token', data.session.access_token)
      redirectUrl.searchParams.set('refresh_token', data.session.refresh_token)
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(redirectUrl.toString())
      } else if (forwardedHost) {
        redirectUrl.protocol = 'https'
        redirectUrl.host = forwardedHost
        return NextResponse.redirect(redirectUrl.toString())
      } else {
        return NextResponse.redirect(redirectUrl.toString())
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}