"use client"
import { AppSidebar } from "@/components/app-sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbPage,
//   BreadcrumbList,
// } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoalCard } from "@/components/dashboard/goal-card"
import { ChecklistCard } from "@/components/dashboard/checklist-card"
import { CalendarCard } from "@/components/dashboard/calendar-card"
import { CalendarNote } from "@/components/dashboard/calendar-note"
import { RecentOffersCard } from "@/components/dashboard/recent-offers-card"
import { NewsCard } from "@/components/dashboard/news-card"
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ListIcon } from 'lucide-react'
import { BellIcon } from 'lucide-react'

type Offer = {
  id: number
  position: string
  company: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState<Offer[]>([])
  const [profile, setProfile] = useState<{ is_subscribed: boolean, subscribed_till: string | null }>()

  useEffect(() => {
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    if (access_token) {
      localStorage.setItem('supabase_access_token', access_token)
      if (refresh_token) {
        localStorage.setItem('supabase_refresh_token', refresh_token)
      }
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      const { data } = await supabase
        .from('profile')
        .select('is_subscribed, subscribed_till')
        .eq('user_id', session.user.id)
        .single()

      if (data) {
        setProfile({
          is_subscribed: !!data.is_subscribed,
          subscribed_till: data.subscribed_till
        })
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchOffers = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      // Pobierz 3 ostatnie oferty ze statusem "Kontakt"
      const { data: contactOffers, error: contactError } = await supabase
        .from('offers')
        .select('*')
        .eq('owner', session.user.id)
        .eq('status', 'Kontakt')
        .order('created_at', { ascending: false })
        .limit(4)

      if (contactError) {
        console.error('Error fetching contact offers:', contactError.message)
        return
      }

      // Pobierz 3 ostatnie oferty (niezależnie od statusu)
      const { data: recentOffers, error: recentError } = await supabase
        .from('offers')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })
        .limit(4)

      if (recentError) {
        console.error('Error fetching recent offers:', recentError.message)
        return
      }

      // Jeśli nie ma ofert ze statusem "Kontakt", pobierz 6 ostatnich ofert
      if (!contactOffers?.length) {
        const { data: allOffers, error: allError } = await supabase
          .from('offers')
          .select('*')
          .eq('owner', session.user.id)
          .order('created_at', { ascending: false })
          .limit(6)
        
        if (allError) {
          console.error('Error fetching all offers:', allError.message)
          return
        }


        setOffers(allOffers || [])
      } else {
        // Połącz oferty ze statusem "Kontakt" i ostatnie oferty, usuń duplikaty
        const combinedOffers = [...(contactOffers || []), ...(recentOffers || [])]
        const uniqueOffers = Array.from(new Map(combinedOffers.map(offer => [offer.id, offer])).values())
        setOffers(uniqueOffers.slice(0, 6))
      }
    }

    fetchOffers()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50 p-0">
        <header className="flex h-16 shrink-0 items-center border-b border-gray-100/50 bg-gray-50">
          {/* <div className="flex items-center gap-8 ml-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div> */}
          <CalendarNote />
        </header>
        <div className="flex flex-col gap-4 p-4 mt-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 ml-2">
              <GoalCard />
            </div>
            <div className="md:col-span-2">
              <ChecklistCard key={Date.now()} />
            </div>
            <div className="md:col-span-1 mr-2">
              <CalendarCard />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="md:col-span-2 ml-2">
              <RecentOffersCard offers={offers} />
            </div>
            <div className="md:col-span-1 mr-2">
              <NewsCard profile={profile} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
