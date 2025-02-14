import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  
  // Inicjalizacja odpowiedzi
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Konfiguracja Supabase z obsługą ciasteczek
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Sprawdź sesję użytkownika
  const { data: { user } } = await supabase.auth.getUser()

  // Przekierowanie niezalogowanych użytkowników
  if (
    !user && 
    (request.nextUrl.pathname.startsWith('/home') || 
    request.nextUrl.pathname.startsWith('/saved') || 
    request.nextUrl.pathname.startsWith('/cv'))
  ) {
    const redirectUrl = new URL('/auth', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Obsługa CORS dla preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Dodaj nagłówki CORS do normalnych żądań
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export const config = {
  matcher: ['/api/:path*', '/home/:path*', '/saved/:path*', '/cv/:path*']
}






