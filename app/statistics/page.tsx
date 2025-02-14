"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WeeklyBarChart } from "@/components/dashboard/bar-chart"
import { CompanyPieChart } from "@/components/dashboard/pie-chart"
import { CalendarNote } from "@/components/dashboard/calendar-note"

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    saved: 0,
    sent: 0,
    contact: 0,
    interview: 0,
    rejected: 0,
    offer: 0
  });
  const [weeklyData, setWeeklyData] = useState<Array<{ name: string; zapisane: number; wyslane: number }>>([]);
  const [companiesData, setCompaniesData] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Błąd sesji:', sessionError);
        return;
      }

      // Pobierz wszystkie oferty użytkownika
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('owner', session.user.id);

      if (offersError) {
        console.error('Błąd pobierania ofert:', offersError);
        return;
      }

      // Oblicz statystyki
      const newStats = {
        saved: offers.filter(offer => offer.status === 'Zapisana').length,
        sent: offers.filter(offer => offer.status === 'Wysłana').length,
        contact: offers.filter(offer => offer.status === 'Kontakt').length,
        interview: offers.filter(offer => offer.status === 'Rozmowa').length,
        rejected: offers.filter(offer => offer.status === 'Odmowa').length,
        offer: offers.filter(offer => offer.status === 'Oferta').length
      };
      setStats(newStats);

      // Oblicz dane dla ostatnich 14 dni
      const today = new Date();
      const last14Days = Array(14).fill(0).map((_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (13 - index));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      const dailyStats = last14Days.map(date => ({
        zapisane: 0,
        wyslane: 0
      }));

      offers.forEach(offer => {
        const offerDate = new Date(offer.created_at);
        const dayIndex = last14Days.findIndex(date => 
          offerDate.getDate() === date.getDate() &&
          offerDate.getMonth() === date.getMonth() &&
          offerDate.getFullYear() === date.getFullYear()
        );
        if (dayIndex !== -1) {
          if (offer.status === 'Zapisana') {
            dailyStats[dayIndex].zapisane++;
          } else if (offer.status === 'Wysłana') {
            dailyStats[dayIndex].wyslane++;
          }
        }
      });

      setWeeklyData(last14Days.map((date, index) => ({
        name: date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }),
        zapisane: dailyStats[index].zapisane,
        wyslane: dailyStats[index].wyslane
      })));

      // Oblicz statystyki stron z ofertami
      const sitesStats = offers.reduce((acc: { [key: string]: number }, offer) => {
        const site = offer.site.toLowerCase();
        let siteName = null;
        
        if (site.includes('pracuj.pl')) siteName = 'Pracuj.pl';
        else if (site.includes('nofluffjobs')) siteName = 'NoFluffJobs';
        else if (site.includes('justjoin.it')) siteName = 'JustJoinIT';
        else if (site.includes('linkedin')) siteName = 'LinkedIn';
        else if (site.includes('indeed')) siteName = 'Indeed';
        else if (site.includes('rocketjobs')) siteName = 'RocketJobs';
        else if (site.includes('gowork.pl') || site.includes('gowork')) siteName = 'GoWork';
        else if (site.includes('bulldog')) siteName = 'BulldogJob';
        else if (site.includes('protocol')) siteName = 'theprotocol.it';
        else if (site.includes('solid')) siteName = 'Solid.Jobs';

        // Dodaj do statystyk tylko jeśli znaleziono zdefiniowany portal
        if (siteName) {
          acc[siteName] = (acc[siteName] || 0) + 1;
        }

        // Debug log
        console.log(`URL: ${site}, Mapped to: ${siteName}`);
        
        return acc;
      }, {});

      const sortedSites = Object.entries(sitesStats)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value }));

      setCompaniesData(sortedSites);
    };

    fetchData();

    const interval = setInterval(fetchData, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50 p-0">
        <header className="flex h-16 shrink-0 items-center border-b border-gray-100/50 bg-gray-50">
          <div className="flex items-center gap-8 ml-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <CalendarNote />
        </header>
        <div className="h-[400px] flex flex-1 flex-col mt-4 gap-4 p-4 bg-gray-50 ml-2 mr-2">
          <StatsCards
            saved={stats.saved}
            sent={stats.sent}
            contact={stats.contact}
            interview={stats.interview}
            rejected={stats.rejected}
            offer={stats.offer}
          />
          <div className="grid gap-4 mt-4 md:grid-cols-6">
            <div className="col-span-4 rounded-xl bg-white shadow-xl">
              <WeeklyBarChart data={weeklyData} />
            </div>
            <div className="col-span-2 rounded-xl bg-white shadow-xl">
              <CompanyPieChart data={companiesData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
