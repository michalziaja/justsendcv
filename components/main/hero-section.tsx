import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HexagonIcon, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20" />
      
      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 text-purple-500/20">
        <HexagonIcon className="h-64 w-64" />
      </div>
      <div className="absolute left-0 bottom-0 text-cyan-500/20">
        <HexagonIcon className="h-48 w-48" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid gap-8 lg:grid-cols-2 items-start max-w-7xl mx-auto">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span>Powered by AI</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none">
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
                  Zmień sposób w jaki szukasz pracy
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-xl">
              JustSend.cv to inteligentne narzędzie, które wykorzystuje AI do optymalizacji Twojego CV 
              pod konkretne oferty pracy. Automatycznie analizuje wymagania, dostosowuje dokumenty 
              i śledzi postępy aplikacji - wszystko w jednym miejscu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-[#20b5fa] to-[#1995ce] hover:from-purple-700 hover:to-cyan-600 px-8">
                Rozpocznij za darmo
              </Button>
              <Button size="lg" variant="outline" className="group">
                Zobacz demo
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </div>
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Darmowe konto</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Bez zobowiązań</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 mt-12 lg:mt-16">
            <div className="relative aspect-square">
              <Image
                src="/dashboard.png"
                alt="Dashboard Preview"
                width={800}
                height={800}
                className="rounded-lg shadow-2xl"
                priority
              />
              {/* Feature highlights */}
              {/* <div className="absolute -right-4 top-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-[200px]">
                <div className="text-sm font-medium">Dopasowanie do oferty</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div> */}
            </div>
            <div className="absolute -bottom-4 -left-4 aspect-square w-32 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 blur-2xl opacity-50" />
            <div className="absolute -top-4 -right-4 aspect-square w-32 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 blur-2xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}
