import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { refresh_token } = await request.json();
    
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore).get(name)?.value
          },
        },
      }
    );
    
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token
    });
    
  } catch (error) {
    console.error('Błąd odświeżania tokena:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas odświeżania tokena' },
      { status: 500 }
    );
  }
} 