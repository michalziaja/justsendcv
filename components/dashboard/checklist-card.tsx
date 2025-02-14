"use client"

import {
  CheckCircle2Icon,
  XCircleIcon,
  BookUserIcon,
  BookmarkIcon,
  FileTextIcon,
  SearchCheckIcon,
  TargetIcon,
  SendIcon,
  CalendarIcon,
  UserIcon,
  MessageSquareIcon,
  GraduationCapIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
interface Checklist {
  hasCv: boolean
  hasGoalSet: boolean
  hasThreeOffers: boolean
  hasMatchedOffer: boolean
  extensionInstalled: boolean
  offerStatus: boolean
  calendarNote: boolean
  profileCompleted: boolean
  messageGenerated: boolean
  interviewPractice: boolean
}

const defaultChecklist: Checklist = {
  hasCv: false,
  hasGoalSet: false,
  hasThreeOffers: false,
  hasMatchedOffer: false,
  extensionInstalled: false,
  offerStatus: false,
  calendarNote: false,
  profileCompleted: false,
  messageGenerated: false,
  interviewPractice: false
}

export function ChecklistCard() {
  const [checklist, setChecklist] = useState<Checklist>(defaultChecklist)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshChecklist, setRefreshChecklist] = useState(false);
  const router = useRouter()

  const isCompleted = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return false;

    const { data: profile } = await supabase
      .from('profile')
      .select('checklist')
      .eq('user_id', session.user.id)
      .single()

    if (!profile?.checklist) return false;

    const dbChecklist = typeof profile.checklist === 'string'
      ? JSON.parse(profile.checklist)
      : profile.checklist;

    return Object.values(dbChecklist).every(value => value === true);
  }

  // Dodajemy nowy stan dla statusu ukończenia
  const [isCompletedState, setIsCompletedState] = useState(false)

  // Sprawdzamy status ukończenia przy każdym odświeżeniu checklisty
  useEffect(() => {
    const checkCompletion = async () => {
      const completed = await isCompleted()
      setIsCompletedState(completed)
    }
    checkCompletion()
  }, [refreshChecklist])

  // Odczytaj stan z tabel profile, cv_data i ai_ats przy inicjalizacji LUB gdy refreshChecklist się zmieni
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setInitialLoading(false)
        return
      }

      try {
        const { data: profile } = await supabase
          .from('profile')
          .select('checklist')
          .eq('user_id', session.user.id)
          .single()

        if (profile?.checklist) {
          const dbChecklist = typeof profile.checklist === 'string'
            ? JSON.parse(profile.checklist)
            : profile.checklist

          setChecklist(dbChecklist)
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [refreshChecklist])

  // Jeśli trwa ładowanie początkowe, nie pokazuj nic
  if (initialLoading) {
    return (
      <Card className="p-6 space-y-4 bg-white shadow-xl h-[400px]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-2 p-1">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  // Sprawdź faktyczny stan warunków po kliknięciu przycisku
  const checkStatus = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const userId = session.user.id;

      // Pobierz dane profilu
      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .single()

      // Sprawdź czy istnieje wpis CV
      const { data: cvData } = await supabase
        .from('cv_data')
        .select('id')
        .eq('owner', userId)
        .maybeSingle();

      // Sprawdź czy istnieją dopasowane oferty
      const { data: atsMatches } = await supabase
        .from('ai_ats')
        .select('id')
        .eq('owner', userId)

      // Sprawdź faktyczny stan warunków
      const { data: offers } = await supabase
        .from('offers')
        .select('status')
        .eq('owner', userId)

      // Sprawdź kalendarz
      const { data: profileCalendar } = await supabase
        .from('profile')
        .select('calendar')
        .eq('user_id', userId)
        .single()

      const hasNonSavedOffer = offers?.some(offer => offer.status !== 'Zapisana') || false
      const hasCalendarNote = profileCalendar?.calendar && 
        profileCalendar.calendar !== '{}' && 
        profileCalendar.calendar !== null

      const newChecklist = {
        hasCv: !!cvData,
        hasGoalSet: !!(profile?.goal && profile.goal > 0),
        hasThreeOffers: !!(offers && offers.length >= 3),
        hasMatchedOffer: !!(atsMatches && atsMatches.length > 0),
        extensionInstalled: true,
        offerStatus: hasNonSavedOffer,
        calendarNote: hasCalendarNote,
        profileCompleted: false,
        messageGenerated: false,
        interviewPractice: false
      }

      // Aktualizuj bazę danych
      const { error: updateError } = await supabase
        .from('profile')
        .update({ 
          checklist: newChecklist 
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Błąd aktualizacji checklisty:', updateError)
      } else {
        setChecklist(newChecklist)
        setRefreshChecklist(prev => !prev)
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania statusu:', error)
    } finally {
      setLoading(false)
    }
  }

  const ChecklistItem = ({ completed, text, icon: Icon }: { completed: boolean; text: string; icon: any }) => (
    <div className={`flex items-center space-x-2 p-1 rounded-lg transition-colors ${
      completed ? 'bg-green-50' : 'bg-red-50'
    }`}>
      <div className={`p-1.5 rounded-full ${
        completed ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <span className={`text-sm font-medium ${
          completed ? 'text-green-700' : 'text-red-700'
        }`}>
          {text}
        </span>
      </div>
      <div>
        {completed ? (
          <CheckCircle2Icon className="h-6 w-6 text-green-500" />
        ) : (
          <XCircleIcon className="h-6 w-6 text-red-500" />
        )}
      </div>
    </div>
  )

  if (isCompletedState) {
    return (
      <Card className="p-6 space-y-4 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] text-white shadow-xl h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="animate-bounce">
                <CheckCircle2Icon className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="pt-16">
            <h2 className="text-2xl font-bold mb-4">Wszystkie zadania ukończone!</h2>
            <div className="space-y-2 text-white/90">
              <p>Gratulacje! Ukończyłeś wszystkie zadania początkowe.</p>
              <p>Teraz możesz w pełni korzystać z aplikacji:</p>
              <br />
              <ul className="list-disc list-inside text-m space-y-1 text-left ml-4">
                <li>Zapisuj oferty pracy za pomocą wtyczki</li>
                <li>Dopasowuj swoje CV do ofert</li>
                <li>Śledź postępy w wysyłaniu aplikacji</li>
                <li>Zarządzaj swoimi aplikacjami</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-2 shadow-xl border-2 h-[400px]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="ml-4 text-2xl font-bold text-gray-800">Checklista</h2>
        
        <div className="p-2 mt-2 mr-4 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-lg">
          <CheckCircle2Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      <Separator className="mb-3 mt-1" />
      <div className="grid grid-cols-2 gap-4 ml-4 mr-4">
        <div className="space-y-1.5">
          <ChecklistItem
            completed={checklist.extensionInstalled}
            text="Zainstaluj wtyczkę"
            icon={BookUserIcon}
          />
          <ChecklistItem
            completed={checklist.hasThreeOffers}
            text="Zapisz przynajmniej 3 oferty"
            icon={BookmarkIcon}
          />
          <ChecklistItem
            completed={checklist.hasCv}
            text="Dodaj lub stwórz CV"
            icon={FileTextIcon}
          />
          <ChecklistItem
            completed={checklist.hasMatchedOffer}
            text="Dopasuj CV do oferty"
            icon={SearchCheckIcon}
          />
          <ChecklistItem
            completed={checklist.hasGoalSet}
            text="Ustaw cel tygodniowy"
            icon={TargetIcon}
          />
        </div>

        <div className="space-y-1.5">
          <ChecklistItem
            completed={checklist.offerStatus}
            text="Wyślij CV - Zmień status oferty"
            icon={SendIcon}
          />
          <ChecklistItem
            completed={checklist.calendarNote}
            text="Dodaj notatkę do kalendarza"
            icon={CalendarIcon}
          />
          <ChecklistItem
            completed={checklist.profileCompleted}
            text="Uzupełnij swój profil"
            icon={UserIcon}
          />
          <ChecklistItem
            completed={checklist.messageGenerated}
            text="Wygeneruj wiadomość dla HR"
            icon={MessageSquareIcon}
          />
          <ChecklistItem
            completed={checklist.interviewPractice}
            text="Zrób trening przed rekrutacją"
            icon={GraduationCapIcon}
          />
        </div>
      </div>

      <Button
        className="w-[96%] mr-4 ml-4 mt-6 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] hover:opacity-90 text-white font-medium h-9 text-sm shadow-md"
        onClick={checkStatus}
        disabled={loading}
      >
        {loading ? 'Sprawdzanie...' : 'Sprawdź postęp'}
      </Button>
    </Card>
  )
}