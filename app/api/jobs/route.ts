import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      console.log('No Authorization header');
      return new NextResponse('Unauthorized - No token', { status: 401 });
    }

    // Pobierz token z nagłówka
    const token = authHeader.replace('Bearer ', '');

    // Tworzymy klienta Supabase z tokenem użytkownika
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Weryfikuj token przez Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Invalid token or no user:', authError);
      return new NextResponse('Unauthorized - Invalid token', { status: 401 });
    }

    console.log('Authenticated user:', user.email);

    // Pobierz dane z żądania
    const jobData = await request.json();
    console.log('Received job data:');

    // Walidacja wymaganych pól
    const requiredFields = ['site', 'position', 'company', 'url'];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        console.log(`Missing required field: ${field}`);
        return new NextResponse(`Missing required field: ${field}`, { status: 400 });
      }
    }

    // Jeśli mamy fullText, przetwarzamy tekst przez Gemini
    if (jobData.fullText) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

        const prompt = `Przeanalizuj poniższy opis stanowiska pracy i wyodrębnij z niego dwie sekcje:
1. Obowiązki, zadania, opis stanowiska pracy
2. Wymagania, umiejętności, technologie, mile widziane

Bądz dokładny i staraj sie wydobyc wszystkie informacje. 

Zwróć odpowiedź w formacie JSON:
{
  "responsibilities": "lista obowiązków...",
  "requirements": "lista wymagań..."
}

Opis stanowiska:
${jobData.fullText}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const formattedText = response.text();
        // Usuń znaczniki Markdown jeśli występują
        const cleanedText = formattedText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        
        try {
          const parsedResult = JSON.parse(cleanedText);
          // Handle parsed JSON if it's valid
          jobData.responsibilities = parsedResult.responsibilities || '';
          jobData.requirements = parsedResult.requirements || '';
        } catch (error) {
          console.error('Error parsing Gemini response:', error);
          // If JSON parse fails, try splitting sections manually
          const sections = formattedText.split('\n\n');
          jobData.responsibilities = sections.find(s => s.toLowerCase().includes('obowiązki') || s.toLowerCase().includes('zadania')) || '';
          jobData.requirements = sections.find(s => s.toLowerCase().includes('wymagania')) || '';
        }
      } catch (geminiError) {
        console.error('Error processing Gemini response:');
        return new NextResponse('Error processing Gemini response', { status: 500 });
      }
    }

    // Przygotuj dane do zapisu
    const dataToInsert = {
      site: jobData.site,
      position: jobData.position,
      company: jobData.company,
      url: jobData.url,
      status: 'Zapisana',
      owner: user.id,
      responsibilities: jobData.responsibilities || '',
      requirements: jobData.requirements || '',
      full_text: jobData.fullText || '',
    };

    console.log('Attempting to insert data:');

    // Zapisz do bazy danych
    const { data: insertedData, error: insertError } = await supabase
      .from('offers')
      .insert([dataToInsert])
      .select();

    if (insertError) {
      console.error('Database error:', insertError);
      return new NextResponse(`Database error: ${insertError.message}`, { status: 500 });
    }

    console.log('Successfully inserted data:');
    return NextResponse.json(insertedData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Unexpected error occurred', { status: 500 });
  }
}
