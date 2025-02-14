import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            JustSend.cv
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#cennik" className="text-foreground/60 hover:text-foreground transition-colors">
              Cennik
            </Link>
            <Link href="#faq" className="text-foreground/60 hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <Button asChild variant="default" size="lg" className="bg-gradient-to-r from-[#20b5fa] to-[#1995ce] hover:from-purple-700 hover:to-cyan-600 px-8">
            <Link href="/auth">
              Zaloguj
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

