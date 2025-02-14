import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Pobierz token z nagłówka Authorization
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Brak tokenu autoryzacji' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Utwórz klienta Supabase
    const cookieStore = cookies()
    const supabase = await createClient()

    // Pobierz dane użytkownika
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    // Pobierz aktualną checklistę z profilu
    const { data: profile } = await supabase
      .from('profile')
      .select('checklist')
      .eq('user_id', user.id)
      .single()

    // Przygotuj nową checklistę z ustawionym extensionInstalled
    let checklist = profile?.checklist || {
      hasCv: false,
      hasGoalSet: false,
      hasThreeOffers: false,
      hasMatchedOffer: false,
      extensionInstalled: false
    }
    
    if (typeof checklist === 'string') {
      checklist = JSON.parse(checklist)
    }

    const newChecklist = {
      hasCv: checklist.hasCv || false,
      hasGoalSet: checklist.hasGoalSet || false,
      hasThreeOffers: checklist.hasThreeOffers || false,
      hasMatchedOffer: checklist.hasMatchedOffer || false,
      extensionInstalled: true
    }

    // Aktualizuj profil tylko jeśli extensionInstalled nie było jeszcze ustawione
    if (!checklist.extensionInstalled) {
      await supabase
        .from('profile')
        .update({ checklist: newChecklist })
        .eq('user_id', user.id)
    }

    // Zwróć podstawowe dane użytkownika
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Użytkownik',
    })
  } catch (error) {
    console.error('Błąd podczas pobierania danych użytkownika:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania danych użytkownika' },
      { status: 500 }
    )
  }
} 