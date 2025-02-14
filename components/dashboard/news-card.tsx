"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BellIcon } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface NewsCardProps {
  profile: {
    is_subscribed: boolean
    subscribed_till: string | null
  } | undefined
}

export function NewsCard({ profile }: NewsCardProps) {
  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-xl border p-4 h-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="ml-2 text-2xl font-bold text-gray-800">Aktualności</h2>
          <div className="p-2 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-lg">
            <BellIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <Separator className="mb-4 mt-4" />
        <div className="space-y-4 ml-2">
          <div>
            <h3 className="text-medium font-bold mb-1">Nowości</h3>
            <p className="text-sm  text-gray-500">-Dodanie checklisty dla nowych</p>
          </div>
          <div>
            <h3 className="text-medium font-bold mb-1">Ostatnia aktualizacja</h3>
            <p className="text-xs text-gray-500">{format(new Date(), 'd MMM yyyy', { locale: pl })}</p>
          </div>
          <div>
            <h3 className="text-medium font-bold mb-1">Wersja aplikacji</h3>
            <p className="text-xs text-gray-500">1.0 beta</p>
          </div>
          <div className="flex items-center justify-between mt-auto mb-4">
            <div>
              <h3 className="text-medium font-bold mb-1">Konto Premium</h3>
              <p className="text-xs">
                {profile?.is_subscribed ? (
                  <>
                    <span className="text-green-600 font-medium">Aktywne</span>
                    {profile.subscribed_till && (
                      <span className="text-gray-500"> (do {format(new Date(profile.subscribed_till), 'd MMM yyyy', { locale: pl })})</span>
                    )}
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Nieaktywne</span>
                )}
              </p>
            </div>
            <button 
              className="px-6 py-2 rounded-md text-white text-lg font-bold bg-gradient-to-r from-purple-500 to-cyan-400 hover:opacity-90 transition-opacity"
            >
              Subskrypcja
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 