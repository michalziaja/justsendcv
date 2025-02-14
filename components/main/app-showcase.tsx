import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Target, BarChart3, Sparkles, Chrome, ListChecks } from "lucide-react"

export function AppShowcase() {
  return (
    <section className="container mx-auto py-24 px-4 md:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Wszystko czego potrzebujesz do <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">skutecznej aplikacji</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          JustSend.cv to kompleksowe narzędzie wspierane przez AI, które pomoże Ci zoptymalizować proces poszukiwania pracy
        </p>
      </div>

      {/* Główne funkcje */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Chrome className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold">Śledzenie Aplikacji</h3>
          <p className="text-muted-foreground">
            Zapisuj oferty jednym kliknięciem z największych portali pracy. Śledź status aplikacji i otrzymuj powiadomienia o zmianach.
          </p>
        </Card>
        
        

        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <Target className="h-6 w-6 text-cyan-600" />
          </div>
          <h3 className="text-xl font-semibold">Dopasowanie do Ofert</h3>
          <p className="text-muted-foreground">
            AI analizuje oferty pracy i pokazuje poziom dopasowania Twojego CV. Otrzymujesz konkretne sugestie, co warto podkreślić lub dodać.
          </p>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold">Inteligentny Kreator CV</h3>
          <p className="text-muted-foreground">
            Twórz profesjonalne CV z pomocą AI. System automatycznie analizuje Twoje doświadczenie i sugeruje najlepsze sformułowania.
          </p>
        </Card>
        
      </div>

      {/* Showcase Screenshots */}
      <div className="space-y-24">
        {/* Kreator CV */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            <h3 className="text-2xl font-bold">Kreator CV z Inteligentnymi Sugestiami</h3>
            <p className="text-muted-foreground">
              Nasz kreator CV wykorzystuje sztuczną inteligencję, aby pomóc Ci stworzyć dokumenty, które wyróżnią się na tle innych. 
              System analizuje trendy w Twojej branży i sugeruje najlepsze sposoby prezentacji Twoich umiejętności.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Profesjonalne szablony CV</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sugestie słów kluczowych</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Automatyczna optymalizacja treści</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <Image
              src="/cv-creator.png"
              alt="CV Creator Preview"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 aspect-square w-32 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 blur-2xl opacity-50" />
          </div>
        </div>

        {/* Analiza Dopasowania */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <Image
              src="/matching.png"
              alt="Job Matching Preview"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -top-4 -left-4 aspect-square w-32 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 blur-2xl opacity-50" />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 px-4 py-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              <Target className="h-4 w-4" />
              <span>Smart Matching</span>
            </div>
            <h3 className="text-2xl font-bold">Inteligentne Dopasowanie do Ofert</h3>
            <p className="text-muted-foreground">
              Zapomnij o ręcznym dostosowywaniu CV do każdej oferty. Nasz system automatycznie analizuje wymagania 
              i pokazuje, jak dobrze Twoje CV pasuje do danej pozycji.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analiza wymagań w czasie rzeczywistym</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Spersonalizowane sugestie ulepszeń</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Automatyczne dostosowanie CV</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Śledzenie Aplikacji */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
              <Chrome className="h-4 w-4" />
              <span>Rozszerzenie Chrome</span>
            </div>
            <h3 className="text-2xl font-bold">Zapisuj i Śledź Aplikacje w Jednym Miejscu</h3>
            <p className="text-muted-foreground">
              Dzięki naszemu rozszerzeniu do Chrome, możesz zapisywać oferty pracy bezpośrednio z największych portali, 
              takich jak Pracuj.pl, NoFluffJobs czy JustJoinIT. Wszystkie Twoje aplikacje są automatycznie śledzone 
              i organizowane w jednym miejscu.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Integracja z największymi portalami pracy</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Zapisywanie ofert jednym kliknięciem</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Automatyczne śledzenie statusu</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Powiadomienia o zmianach statusu</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <Image
              src="/tracking.png"
              alt="Application Tracking Preview"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
            />
            {/* Status karty */}
            <div className="absolute -right-4 top-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="h-5 w-5 text-purple-600" />
                <div className="text-sm font-medium">Status aplikacji</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-500">●</span>
                  <span className="flex-1 ml-2">Aplikacja wysłana</span>
                  <span className="text-muted-foreground">2/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-500">●</span>
                  <span className="flex-1 ml-2">W trakcie</span>
                  <span className="text-muted-foreground">2/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-500">●</span>
                  <span className="flex-1 ml-2">Rozmowa</span>
                  <span className="text-muted-foreground">1/5</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 aspect-square w-32 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 blur-2xl opacity-50" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-24">
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600">
          Wypróbuj za darmo
        </Button>
      </div>
    </section>
  )
}

