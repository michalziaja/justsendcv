import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from '@/utils/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { cv, job, userId } = await req.json()
    const supabase = await createClient()
    console.log(cv)
    // Przygotuj prompt dla AI
    // const prompt = `
    // Jako ekspert ATS (Applicant Tracking System) i rekrutacji, przeanalizuj CV kandydata i wymagania oferty pracy.
    // Napisz szczegółowe wskazówki, jak zoptymalizować CV pod kątem tej konkretnej oferty.
    
    // Aktualne CV kandydata:
    // ${cv.full_text}

    // Dane CV w formacie strukturalnym:
    // - Doświadczenie: ${JSON.stringify(cv.experience)}
    // - Umiejętności techniczne: ${JSON.stringify(cv.skills?.technical)}
    // - Umiejętności miękkie: ${JSON.stringify(cv.skills?.soft)}
    // - Edukacja: ${JSON.stringify(cv.education)}
    // - Certyfikaty: ${JSON.stringify(cv.other?.certificates)}

    // Oferta pracy:
    // - Stanowisko: ${job.position}
    // - Firma: ${job.company}
    // - Wymagania: ${job.requirements}
    // - Zakres obowiązków: ${job.responsibilities}

    // Przeanalizuj dokładnie obecne CV i zaproponuj konkretne zmiany, uwzględniając:
    // 1. Jakie słowa kluczowe z oferty powinny zostać dodane i w których miejscach CV
    // 2. Jak przeformułować konkretne fragmenty CV, aby lepiej pasowały do oferty
    // 3. Które umiejętności należy lepiej wyeksponować lub dodać
    // 4. Jakie zmiany w formatowaniu i strukturze CV pomogą w lepszym przejściu przez systemy ATS

    // Napisz szczegółową odpowiedź w języku polskim, wskazując dokładnie co i jak zmienić w obecnym CV.
    // Używaj prostego czytelnego formatowania, bez zbędnych znaków takich jak *.
    // Zwracaj sie zawsze do kandydata w formie "Ty"`

    const prompt = `
    Jako ekspert ATS (Applicant Tracking System) i rekrutacji, przeanalizuj CV kandydata i wymagania oferty pracy. 
    Napisz szczegółowe wskazówki, jak zoptymalizować CV pod kątem tej konkretnej oferty.

    **Aktualne CV kandydata:**
    ${cv.full_text}

    **Dane CV w formacie strukturalnym:**
    - Doświadczenie: ${JSON.stringify(cv.experience)}
    - Umiejętności techniczne: ${JSON.stringify(cv.skills?.technical)}
    - Umiejętności miękkie: ${JSON.stringify(cv.skills?.soft)}
    - Edukacja: ${JSON.stringify(cv.education)}
    - Certyfikaty: ${JSON.stringify(cv.other?.certificates)}

    **Oferta pracy:**
    - Stanowisko: ${job.position}
    - Firma: ${job.company}
    - Wymagania: ${job.requirements}
    - Zakres obowiązków: ${job.responsibilities}

    **Instrukcja dla Ciebie (eksperta):**
    1. Przeanalizuj CV i ofertę pracy, zwracając uwagę na słowa kluczowe, wymagania oraz obszary do poprawy w CV.
    2. Udziel szczegółowych wskazówek, jakie zmiany należy wprowadzić w CV, aby lepiej pasowało do oferty.
    3. Unikaj formatowania w stylu Markdown (np. nie używaj gwiazdek, ani innych znaków formatowania).
    4. Twoja odpowiedź powinna być klarowna i logicznie uporządkowana, z nagłówkami i sekcjami opisującymi konkretne zmiany.

    **Oczekiwany format odpowiedzi:**
    1. **Słowa kluczowe:**
    - Jakie słowa kluczowe należy dodać (konkretne przykłady).
    - W których sekcjach CV je wprowadzić (np. doświadczenie, umiejętności, podsumowanie).

    2. **Przeformułowanie treści:**
    - Konkretnie wskaż, które fragmenty CV wymagają zmiany, i jak je poprawić (np. zmiana sformułowania lub lepsze dopasowanie do oferty pracy).

    3. **Umiejętności:**
    - Jakie umiejętności wyeksponować.
    - Jakie dodać (jeśli brakuje ich w obecnym CV).
    - Które ewentualnie usunąć lub zmodyfikować.

    4. **Formatowanie i struktura:**
    - Jakie zmiany w strukturze CV wprowadzić, aby lepiej pasowało do systemów ATS.
    - Jakie sekcje dodać, usunąć lub przeorganizować.

    **Przykład odpowiedzi:**
    1. **Słowa kluczowe:**
    - Dodaj frazy takie jak "zarządzanie zespołem", "obsługa klienta premium", "tworzenie strategii sprzedaży" w sekcji "Doświadczenie zawodowe" i "Umiejętności techniczne".
    
    2. **Przeformułowanie treści:**
    - Obecne sformułowanie: "Pracowałem w dziale sprzedaży."
    - Sugerowana zmiana: "Zarządzałem zespołem sprzedażowym, realizując cele miesięczne na poziomie 120% normy."

    3. **Umiejętności:**
    - Wyeksponuj: umiejętności miękkie związane z negocjacjami i zarządzaniem czasem.
    - Dodaj: techniczne umiejętności takie jak znajomość systemów CRM (jeśli są wymagane w ofercie).

    4. **Formatowanie i struktura:**
    - Przenieś sekcję "Edukacja" poniżej sekcji "Doświadczenie".
    - Dodaj sekcję "Podsumowanie zawodowe" na początku CV.

    Pamiętaj, aby odpowiedź była logicznie podzielona i zawierała konkretne przykłady zmian.
    `;

    console.log(prompt) 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Sprawdź czy istnieje już analiza dla tego CV i oferty
    const { data: existingAnalysis } = await supabase
      .from('ai_ats')
      .select('id')
      .eq('cv_id', cv.id.toString())
      .eq('offer_id', job.id.toString())
      .single()

    if (existingAnalysis) {
      // Aktualizuj istniejącą analizę
      const { error: updateError } = await supabase
        .from('ai_ats')
        .update({
          ai_tips: text
        })
        .eq('id', existingAnalysis.id)

      if (updateError) {
        console.error('Error updating database:', updateError)
        throw new Error('Błąd aktualizacji w bazie: ' + updateError.message)
      }
    } else {
      // Dodaj nowy wpis
      const { error: insertError } = await supabase
        .from('ai_ats')
        .insert({
          offer_id: job.id.toString(),
          cv_id: cv.id.toString(),
          owner: userId,
          ai_tips: text
        })

      if (insertError) {
        console.error('Error saving to database:', insertError)
        throw new Error('Błąd zapisu do bazy: ' + insertError.message)
      }
    }

    return NextResponse.json({ tips: text })
  } catch (error) {
    console.error('Error in adjust-cv:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania porad' },
      { status: 500 }
    )
  }
} 