import { Card } from "@/components/ui/card"
import { 
  FileText, 
  Target, 
  BarChart3, 
  BrainCircuit, 
  Bell, 
  Chrome,
  Briefcase,
  LineChart,
  Users
} from "lucide-react"

const features = [
  {
    icon: <FileText className="h-6 w-6 text-purple-600" />,
    title: "Inteligentny Parser CV",
    description: "Automatycznie analizuje i wyodrębnia kluczowe informacje z Twojego CV w formatach PDF i DOCX. Oszczędza czas na ręcznym wprowadzaniu danych."
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-cyan-600" />,
    title: "AI Asystent",
    description: "Sztuczna inteligencja pomaga ulepszyć Twoje CV, sugerując lepsze sformułowania i brakujące umiejętności na podstawie analizy rynku."
  },
  {
    icon: <Target className="h-6 w-6 text-purple-600" />,
    title: "Analiza Dopasowania",
    description: "System automatycznie porównuje Twoje CV z wymaganiami oferty pracy i pokazuje procentowe dopasowanie oraz sugestie ulepszeń."
  },
  {
    icon: <Briefcase className="h-6 w-6 text-cyan-600" />,
    title: "Zarządzanie Aplikacjami",
    description: "Śledź wszystkie swoje aplikacje w jednym miejscu. Status, terminy rozmów i notatki - wszystko uporządkowane i łatwo dostępne."
  },
  {
    icon: <Chrome className="h-6 w-6 text-purple-600" />,
    title: "Rozszerzenie Chrome",
    description: "Zapisuj oferty pracy bezpośrednio ze stron pracodawców. Automatyczna analiza wymagań i dopasowanie do Twojego profilu."
  },
  {
    icon: <Bell className="h-6 w-6 text-cyan-600" />,
    title: "Powiadomienia",
    description: "Otrzymuj powiadomienia o nowych ofertach pasujących do Twojego profilu, zmianach statusu aplikacji i zbliżających się terminach."
  },
  {
    icon: <LineChart className="h-6 w-6 text-purple-600" />,
    title: "Analityka Kariery",
    description: "Śledź swoje postępy w poszukiwaniu pracy. Zobacz statystyki aplikacji, współczynniki odpowiedzi i trendy na rynku pracy."
  },
  {
    icon: <Users className="h-6 w-6 text-cyan-600" />,
    title: "Społeczność i Wsparcie",
    description: "Dołącz do społeczności osób poszukujących pracy. Dziel się doświadczeniami i korzystaj z porad ekspertów HR."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
    title: "Raporty i Statystyki",
    description: "Generuj szczegółowe raporty o swoich postępach w poszukiwaniu pracy. Identyfikuj obszary wymagające poprawy."
  }
]

export function FeaturesSection() {
  return (
    <section className="container mx-auto py-24 px-4 md:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Zaawansowane funkcje dla <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">profesjonalistów</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          JustSend.cv to nie tylko narzędzie do wysyłania CV. To kompleksowa platforma, która pomoże Ci 
          zoptymalizować cały proces poszukiwania pracy i rozwoju kariery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

