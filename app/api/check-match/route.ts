import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from '@/utils/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { cv, job, userId } = await req.json()
    
    if (!cv || !job || !userId) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Przygotuj prompt dla AI
    const prompt = `
    Jako ekspert HR, przeanalizuj zgodność poniższego CV kandydata z wymaganiami oferty pracy.
    Zwróć wynik procentowy (0-100) oraz krótkie uzasadnienie.

    CV Kandydata:
    - Doświadczenie: ${JSON.stringify(cv.experience)}
    - Umiejętności techniczne: ${JSON.stringify(cv.skills?.technical)}
    - Umiejętności miękkie: ${JSON.stringify(cv.skills?.soft)}
    - Edukacja: ${JSON.stringify(cv.education)}
    - Certyfikaty: ${JSON.stringify(cv.other?.certificates)}

    Oferta pracy:
    - Stanowisko: ${job.position}
    - Firma: ${job.company}
    - Wymagania: ${job.requirements}
    - Zakres obowiązków: ${job.responsibilities}

    Odpowiedz w formacie JSON:
    {
      "matchPercentage": liczba od 0 do 100,
      "explanation": "krótkie uzasadnienie wyniku, opisując w jakim stopniu CV kandydata odpowiada wymaganiom oferty pracy maksymalnie 100 słow"
    }
    `
    console.log(prompt) 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Wyciągnij JSON z odpowiedzi
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Nieprawidłowy format odpowiedzi AI')
    }
    
    const parsedResult = JSON.parse(jsonMatch[0])

    // Sprawdź czy istnieje już analiza dla tego CV i oferty
    const { data: existingAnalysis } = await supabase
      .from('ai_ats')
      .select('id')
      .eq('cv_id', cv.id)
      .eq('offer_id', job.id)
      .single()

    if (existingAnalysis) {
      // Aktualizuj istniejącą analizę
      const { error: updateError } = await supabase
        .from('ai_ats')
        .update({
          ai_score: parsedResult.matchPercentage,
          ai_about: parsedResult.explanation
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
          offer_id: job.id,
          cv_id: cv.id,
          owner: userId,
          ai_score: parsedResult.matchPercentage,
          ai_about: parsedResult.explanation
        })

      if (insertError) {
        console.error('Error saving to database:', insertError)
        throw new Error('Błąd zapisu do bazy: ' + insertError.message)
      }
    }

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error('Error in check-match:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas analizy zgodności' },
      { status: 500 }
    )
  }
} 