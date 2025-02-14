import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function parseResumeWithGemini(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Przeanalizuj poniższe CV i zwróć dane w następującym formacie JSON:
    {
      "experience": [
        {
          "position": "stanowisko",
          "company": "nazwa firmy",
          "date": "okres zatrudnienia",
          "description": "opis stanowiska",
          "details": ["szczegół 1", "szczegół 2"]
        }
      ],
      "education": [
        {
          "school": "nazwa szkoły",
          "date": "okres nauki",
          "description": "opis"
        }
      ],
      "skills": ["umiejętność 1", "umiejętność 2"],
      "other": {
        "languages": ["język 1", "język 2"],
        "certificates": ["certyfikat 1", "certyfikat 2"]
      }
    }

    Ważne zasady:
    1. Zachowaj oryginalną pisownię nazw firm, szkół i technologii
    2. Daty powinny być w formacie MM.RRRR-MM.RRRR lub RRRR-RRRR
    3. Umiejętności podziel na techniczne i miękkie
    4. Usuń powtórzenia w umiejętnościach
    5. Zachowaj chronologię doświadczenia (od najnowszego)
    6. Wyodrębnij wszystkie istotne szczegóły z opisów stanowisk
    7. W other wstaw też opis,zainteresowania,motywacje,dodatkowe informacje
    CV do przeanalizowania:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Usuwamy znaczniki Markdown
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    console.log('Oczyszczona odpowiedź:', responseText);
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Błąd parsowania JSON z odpowiedzi Gemini:', error);
      throw new Error('Nie udało się przetworzyć odpowiedzi z AI');
    }
  } catch (error) {
    console.error('Błąd podczas przetwarzania CV przez Gemini:', error);
    throw error;
  }
} 