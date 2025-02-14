import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">O nas</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">O JustSend.cv</Link></li>
                <li><Link href="/team" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Nasz zespół</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Kariera</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Wsparcie</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Kontakt</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">FAQ</Link></li>
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Centrum pomocy</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Prawne</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Polityka prywatności</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Warunki korzystania</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Polityka cookies</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Śledź nas</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} JustSend.cv. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

