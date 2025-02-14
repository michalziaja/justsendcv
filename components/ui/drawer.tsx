"use client"

import * as React from "react"
import { X, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from '@/utils/supabase/client'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  selectedJob: {
    id: number
    url: string
    position: string
    company: string
    requirements: string
    responsibilities: string
    full_text: string
    note: string | null
    status: string
    status_changed: string
  } | null
}

type StatusHistory = {
  id: string
  old_status: string
  new_status: string
  changed_at: string
  changed_by: string
}

export function Drawer({ open, onClose, children, selectedJob }: DrawerProps) {
  const [statusHistory, setStatusHistory] = React.useState<StatusHistory[]>([])
  const [note, setNote] = React.useState("")
  const [isSavingNote, setIsSavingNote] = React.useState(false)
  const [currentStatus, setCurrentStatus] = React.useState("")
  const [isDeletingHistory, setIsDeletingHistory] = React.useState(false)
  const [skills, setSkills] = React.useState<string[]>([])

  const statusStyles = {
    Zapisana: "bg-blue-100 text-blue-700 border-blue-200",
    Wysłana: "bg-purple-100 text-purple-700 border-purple-200",
    Kontakt: "bg-green-100 text-green-700 border-green-200",
    Rozmowa: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Odmowa: "bg-red-100 text-red-700 border-red-200",
    Oferta: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }

  // Pobierz historię statusów i notatkę przy otwarciu drawera
  React.useEffect(() => {
    const fetchJobDetails = async () => {
      if (!selectedJob) return

      setNote(selectedJob.note || "")
      setCurrentStatus(selectedJob.status)

      const supabase = createClient()
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) return

      // Pobierz historię zmian statusów
      const { data: history, error: historyError } = await supabase
        .from('offer_status_history')
        .select('*')
        .eq('offer_id', selectedJob.id)
        .order('changed_at', { ascending: false })

      if (historyError) {
        console.error('Błąd podczas pobierania historii:', historyError)
        return
      }

      setStatusHistory(history || [])
    }

    if (open) {
      fetchJobDetails()
    }
  }, [open, selectedJob])

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedJob) return

    try {
      const supabase = createClient()
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) return

      // Aktualizuj status i status_changed w tabeli offers
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: newStatus,
          status_changed: new Date().toISOString()
        })
        .eq('id', selectedJob.id)

      if (updateError) throw updateError

      // Dodaj wpis do historii zmian
      const { error: historyError } = await supabase
        .from('offer_status_history')
        .insert({
          offer_id: selectedJob.id,
          old_status: currentStatus,
          new_status: newStatus,
          changed_by: session.user.id
        })

      if (historyError) throw historyError

      // Aktualizuj lokalny stan
      setCurrentStatus(newStatus)
      setStatusHistory([
        {
          id: Date.now().toString(),
          old_status: currentStatus,
          new_status: newStatus,
          changed_at: new Date().toISOString(),
          changed_by: session.user.id
        },
        ...statusHistory
      ])

    } catch (err) {
      console.error('Błąd podczas aktualizacji statusu:', err)
    }
  }

  const handleSaveNote = async () => {
    if (!selectedJob) return

    setIsSavingNote(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('offers')
        .update({ note })
        .eq('id', selectedJob.id)

      if (error) throw error
    } catch (err) {
      console.error('Błąd podczas zapisywania notatki:', err)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleDeleteHistoryEntry = async (historyId: string) => {
    if (!selectedJob || isDeletingHistory) return

    setIsDeletingHistory(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('offer_status_history')
        .delete()
        .eq('id', historyId)

      if (error) throw error

      // Aktualizuj lokalny stan
      setStatusHistory(statusHistory.filter(entry => entry.id !== historyId))
    } catch (err) {
      console.error('Błąd podczas usuwania wpisu z historii:', err)
    } finally {
      setIsDeletingHistory(false)
    }
  }

  // Funkcja do ekstrakcji umiejętności z tekstu oferty
  const extractSkills = (text: string) => {
    // Lista popularnych umiejętności technicznych
    const commonSkills = [
      "JavaScript", "TypeScript", "Python", "Java", "C#", "React", "Angular", "Vue.js",
      "Node.js", "Express", "Django", "Flask", "SQL", "MongoDB", "PostgreSQL",
      "AWS", "Azure", "Docker", "Kubernetes", "Git", "CI/CD", "REST API", "GraphQL",
      "HTML", "CSS", "SASS", "Redux", "Next.js", "Nest.js", "Spring", ".NET",
      "Agile", "Scrum", "TDD", "Unit Testing", "Jest", "Cypress"
    ]

    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    )

    return [...new Set(foundSkills)] // Usuń duplikaty
  }

  React.useEffect(() => {
    if (selectedJob?.full_text) {
      const extractedSkills = extractSkills(selectedJob.full_text)
      setSkills(extractedSkills)
    }
  }, [selectedJob])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[50%] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-full">
          {/* Lewa kolumna - szczegóły oferty */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-gray-50 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJob?.position}</h2>
              <p className="text-lg text-gray-600 mt-1">{selectedJob?.company}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
                <div 
                  className="text-gray-700 prose prose-sm max-w-none [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedJob?.full_text || '' 
                  }}
                />
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-gray-100 bg-white mt-auto">
              <Button 
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 shadow-md mt-3"
                asChild
              >
                <a 
                  href={selectedJob?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Otwórz ofertę w nowej karcie
                </a>
              </Button>
            </div>
          </div>

          {/* Prawa kolumna - historia statusów i notatki */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Umiejętności */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Wymagane umiejętności</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-gray-500">Nie znaleziono wymaganych umiejętności</p>
                  )}
                </div>
              </div>

              {/* Notatki */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notatki</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-48 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dodaj notatkę..."
                />
                <Button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSavingNote ? "Zapisywanie..." : "Zapisz notatkę"}
                </Button>
              </div>

              {/* Status i historia zmian */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Status oferty</h3>
                  <Select value={currentStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-[180px] h-9 ${statusStyles[currentStatus as keyof typeof statusStyles]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zapisana" className="bg-blue-50 text-blue-700">Zapisana</SelectItem>
                      <SelectItem value="Wysłana" className="bg-purple-50 text-purple-700">Wysłana</SelectItem>
                      <SelectItem value="Kontakt" className="bg-green-50 text-green-700">Kontakt</SelectItem>
                      <SelectItem value="Rozmowa" className="bg-yellow-50 text-yellow-700">Rozmowa</SelectItem>
                      <SelectItem value="Odmowa" className="bg-red-50 text-red-700">Odmowa</SelectItem>
                      <SelectItem value="Oferta" className="bg-emerald-50 text-emerald-700">Oferta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-700">Historia zmian</h4>
                  <span className="text-sm text-gray-500">Ostatnie 4 zmiany</span>
                </div>
                <div className="space-y-4">
                  {statusHistory.slice(0, 4).map((change, index) => (
                    <div key={change.id} className="relative group">
                      {index < Math.min(statusHistory.length - 1, 3) && (
                        <div className="absolute left-0 top-6 w-0.5 h-full bg-gray-200" />
                      )}
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[change.old_status as keyof typeof statusStyles]}`}>
                                {change.old_status}
                              </span>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[change.new_status as keyof typeof statusStyles]}`}>
                                {change.new_status}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {new Date(change.changed_at).toLocaleString('pl-PL')}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteHistoryEntry(change.id)}
                              disabled={isDeletingHistory}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {statusHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Brak historii zmian</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 



