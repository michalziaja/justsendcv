"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ListIcon } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

type Offer = {
  id: number
  position: string
  company: string
  status: string
  created_at: string
}

interface RecentOffersCardProps {
  offers: Offer[]
}

export function RecentOffersCard({ offers }: RecentOffersCardProps) {
  // Sortuj oferty według daty utworzenia (od najnowszej) i weź 3 pierwsze
  const recentOffers = [...offers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Funkcja zwracająca kolor dla statusu
  const getStatusStyle = (status: string) => {
    const statusStyles = {
      'Kontakt': 'bg-green-100 text-green-800',
      'Rozmowa': 'bg-yellow-100 text-yellow-800',
      'Oferta': 'bg-emerald-100 text-emerald-800',
      'Zapisana': 'bg-blue-100 text-blue-800',
      'Wysłana': 'bg-purple-100 text-purple-800',
      'Odmowa': 'bg-red-100 text-red-800'
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-xl border-2 p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="ml-2 text-2xl font-bold text-gray-800">Ostatnie zapisane oferty</h2>
          <div className="p-2 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-lg">
            <ListIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <Separator className="mb-1" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left font-bold py-2 px-4 text-lg text-black">Stanowisko</th>
                <th className="text-left font-bold py-2 px-4 text-lg text-black">Firma</th>
                <th className="text-left font-bold py-2 px-4 text-lg text-black">Status</th>
                <th className="text-left font-bold py-2 px-4 text-lg text-black">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentOffers.map((offer) => (
                <tr key={offer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm">{offer.position}</td>
                  <td className="py-2 px-4 text-sm">{offer.company}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(offer.status)}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-500">
                    {format(new Date(offer.created_at), 'd MMM yyyy', { locale: pl })}
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500">
                    Brak ofert do wyświetlenia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 