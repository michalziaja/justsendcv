import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { text, field, offerId } = await req.json()

    if (!text || !field || !offerId) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    // Pobierz dane oferty z bazy
    const supabase = await createClient()
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return NextResponse.json(
        { error: 'Nie znaleziono oferty' },
        { status: 404 }
      )
    }

    // Przygotuj prompt dla AI
    // const prompt = `
    // Przeanalizuj i zoptymalizuj opis doświadczenia zawodowego pod kątem wymagań stanowiska, 
    // uwzględniając specyfikę branży i kluczowe aspekty oferty pracy.

    // Kontekst stanowiska:
    // Pozycja: ${offer.position}
    // Firma: ${offer.company}
    // Opis stanowiska: ${offer.full_text || ''}

    // Sekcja do optymalizacji: ${field}
    // Obecny opis:
    // ${text}

    // Wytyczne do optymalizacji opisu:
    // 1. Dostosuj terminologię branżową do wymagań stanowiska
    // 2. Podkreśl kluczowe kompetencje i technologie zbieżne z ofertą
    // 3. Uwypuklij mierzalne rezultaty i osiągnięcia, jesli zostały podane w opisie
    // 4. Zachowaj profesjonalny, rzeczowy ton wypowiedzi
    // 5. Skup się na konkretnych zadaniach i odpowiedzialnościach
    // 6. Uwzględnij istotne wskaźniki efektywności i sukcesy projektowe, jesli zostały podane w opisie

    // Format odpowiedzi:
    // - Użyj bezosobowych form czasowników (np. "wdrożenie", "zarządzanie", "rozwój")
    // - Zastosuj zwięzłe, konkretne sformułowania
    // - Zachowaj strukturę punktową dla przejrzystości
    // - Ogranicz się do najistotniejszych informacji

    // Zwróć wyłącznie zoptymalizowany opis doświadczenia, bez dodatkowych komentarzy.
    // `;

    const prompt = `
      Jesteś ekspertem HR i specjalistą w tworzeniu profesjonalnych CV. 
      Przeanalizuj podany tekst pod kątem wymagań z oferty pracy i zoptymalizuj go według poniższych zasad:

      **Kontekst stanowiska:**
      - Pozycja: ${offer.position}
      - Firma: ${offer.company}
      - Wymagania: ${offer.requirements}
      - Opis stanowiska: ${offer.description}

      **Obecna treść do optymalizacji:**
      ${text}

      **Zasady optymalizacji:**
      1. Użyj aktywnych czasowników (np. "wdrożyłem", "zarządzałem", "zwiększyłem")
      2. Dodaj mierzalne efekty (np. "zmniejszenie kosztów o 20%", "zwiększenie sprzedaży o 15%")
      3. Dopasuj słowa kluczowe z oferty pracy
      4. Zastosuj profesjonalną terminologię branżową
      5. Zachowaj zwięzłość (maks. 3-5 punktów)
      6. Podkreśl osiągnięcia zamiast obowiązków

      **Format wyjściowy:**
      - Zwróć tylko gotowy tekst bez dodatkowych komentarzy
      - Używaj spójnych struktur gramatycznych
      - Maksymalna długość: ${field === 'summary' ? '150 słów' : '250 słów'}

      Przykład dobrej optymalizacji:
      Przed: "Praca z klientami"
      Po: "Średnio 50 konsultacji tygodniowo z 95% satysfakcji klientów"
      `;

    // Wywołaj AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const optimizedText = response.text()

    return NextResponse.json({ optimizedText })
  } catch (error) {
    console.error('Błąd podczas optymalizacji tekstu:', error)
    return NextResponse.json(
      { error: 'Błąd podczas przetwarzania' },
      { status: 500 }
    )
  }
} 