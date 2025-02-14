import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const tiers = [
    {
      name: "Darmowy",
      price: "0 zł",
      description: "Idealne na początek poszukiwania pracy",
      features: [
        "Do 10 zapisanych ofert pracy",
        "Podstawowe szablony CV",
        "Śledzenie statusu aplikacji",
        "Podstawowe statystyki",
      ],
      buttonText: "Rozpocznij za darmo",
      popular: false,
    },
    {
      name: "Tygodniowy",
      price: "8,99 zł",
      period: "/ tydzień",
      description: "Dla aktywnie poszukujących pracy",
      features: [
        "Nielimitowana liczba ofert",
        "Wszystkie szablony CV",
        "Zaawansowane statystyki",
        "Dopasowanie CV przez AI",
        "Priorytetowe powiadomienia",
      ],
      buttonText: "Wybierz plan tygodniowy",
      popular: true,
    },
    {
      name: "Miesięczny",
      price: "27,99 zł",
      period: "/ miesiąc",
      description: "Najlepszy wybór na dłużej",
      features: [
        "Wszystko z planu Weekly",
        "Eksport do różnych formatów",
        "Priorytetowe wsparcie",
        "Analiza rynku pracy",
        "Personalizowane rekomendacje",
      ],
      buttonText: "Wybierz plan miesięczny",
      popular: false,
    },
  ]

  return (
    <section id="cennik" className="container mx-auto py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Wybierz plan dopasowany do Twoich potrzeb
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Zacznij za darmo i rozszerz możliwości, gdy będziesz gotowy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`relative flex flex-col ${
                tier.popular 
                  ? "border-2 border-purple-500 shadow-lg scale-105" 
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-1 text-sm text-white text-center">
                  Najpopularniejszy
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-baseline justify-center text-2xl font-bold">
                  {tier.price}
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <ul className="grid gap-2 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600" 
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

