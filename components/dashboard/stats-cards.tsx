import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkIcon, SendIcon, PhoneCallIcon, XCircleIcon, UserIcon, CheckCircleIcon } from "lucide-react"

interface StatsCardsProps {
  saved: number
  sent: number
  contact: number
  interview: number
  rejected: number
  offer: number
}

export function StatsCards({ saved, sent, contact, interview, rejected, offer }: StatsCardsProps) {
  const stats = [
    {
      title: "ZAPISANE",
      value: saved,
      icon: BookmarkIcon,
      description: "Oczekujące na wysłanie"
    },
    {
      title: "WYSŁANE",
      value: sent,
      icon: SendIcon,
      description: "Wysłane aplikacje"
    },
    {
      title: "KONTAKT",
      value: contact,
      icon: PhoneCallIcon,
      description: "Odpowiedzi od pracodawców"
    },
    {
      title: "ROZMOWA",
      value: interview,
      icon: UserIcon,
      description: "Zaplanowane rozmowy"
    },
    {
      title: "ODMOWA",
      value: rejected,
      icon: XCircleIcon,
      description: "Odrzucone aplikacje"
    },
    {
      title: "OFERTA",
      value: offer,
      icon: CheckCircleIcon,
      description: "Otrzymane oferty"
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-white shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-gray-700 tracking-wide">{stat.title}</CardTitle>
                <p className="text-xs text-gray-500 leading-tight">{stat.description}</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-lg">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-center">
                <div className="text-4xl font-extrabold text-[#1995ce] tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 