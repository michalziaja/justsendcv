import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from '@/utils/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { cv_text, user_id } = await req.json()

    // Przygotuj prompt dla AI
    const prompt = `
    Przeanalizuj poniższe CV i wyodrębnij z niego następujące informacje w formacie JSON:
    1. Dane personalne (obiekt z polami: name, email, phone, address, socials - gdzie socials to obiekt z linkami do profili)
    2. Doświadczenie zawodowe (tablica obiektów z polami: position, company, date, description)
    3. Umiejętności (obiekt z polami: technical - tablica umiejętności technicznych, soft - tablica umiejętności miękkich)
    4. Edukacja (tablica obiektów z polami: school, degree, field, date)
    5. Inne informacje (obiekt z polami: certificates - tablica certyfikatów, languages - tablica języków, hobbies - tablica zainteresowań)
    6. Ocena CV (pole "cv_score": liczba od 0 do 100)
    7. Informacja zwrotna (pole "cv_feedback": krótkie uzasadnienie oceny, max 200 znaków)

    Tekst CV:
    ${cv_text}

    Zwróć dane w następującym formacie JSON:
    {
      "personalInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "socials": {
          "linkedin": "string",
          "github": "string",
          "twitter": "string"
        }
      },
      "experience": [
        {
          "position": "string",
          "company": "string",
          "date": "string",
          "description": "string"
        }
      ],
      "skills": {
        "technical": ["string"],
        "soft": ["string"]
      },
      "education": [
        {
          "school": "string",
          "degree": "string",
          "field": "string",
          "date": "string"
        }
      ],
      "other": {
        "certificates": ["string"],
        "languages": ["string"],
        "hobbies": ["string"]
      },
      "cv_score": 0,
      "cv_feedback": "string"
    }
    `;

    // Wywołaj AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Loguj surowy tekst
    console.log('Surowy tekst:', text)

    // Usuń formatowanie markdown i wyczyść tekst
    text = text.replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .replace(/^\s+|\s+$/g, '') // usuń białe znaki z początku i końca
      .replace(/[\n\r]+/g, '') // usuń znaki nowej linii
      .replace(/\s+/g, ' '); // zamień wielokrotne spacje na pojedyncze

    console.log('Oczyszczony tekst:', text)

    try {
      // Parsuj odpowiedź JSON
      const processedData = JSON.parse(text)
      console.log('Sparsowane dane:', processedData)

      // Zaktualizuj dane w bazie
      const supabase = await createClient()

      // Znajdź CV do aktualizacji
      const { data: cvData, error: findError } = await supabase
        .from('cv_data')
        .select('id')
        .eq('owner', user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (findError) {
        console.error('Błąd podczas szukania CV:', findError)
        throw findError
      }

      // Aktualizuj znalezione CV
      const { error: updateError } = await supabase
        .from('cv_data')
        .update({
          experience: processedData.experience,
          skills: processedData.skills,
          education: processedData.education,
          other: processedData.other,
          score: processedData.cv_score,
          feedback: processedData.cv_feedback,
          personal: {
            name: processedData.personalInfo?.name,
            email: processedData.personalInfo?.email,
            phone: processedData.personalInfo?.phone,
            address: processedData.personalInfo?.address,
            socials: processedData.personalInfo?.socials || {}
          }
        })
        .eq('id', cvData.id)

      if (updateError) {
        console.error('Błąd podczas aktualizacji danych:', updateError)
        return NextResponse.json(
          { error: 'Błąd podczas aktualizacji danych w bazie' },
          { status: 500 }
        );
      }

      return NextResponse.json(processedData)
    } catch (jsonError) {
      console.error('Błąd podczas parsowania JSON:', jsonError)
      return NextResponse.json(
        { error: 'Błąd podczas parsowania JSON' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Błąd podczas przetwarzania CV:', error)
    return NextResponse.json(
      { error: 'Błąd podczas przetwarzania CV' },
      { status: 500 }
    )
  }
}