"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Wand2 } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import debounce from 'lodash/debounce'

interface CVData {
  id?: string;
  owner?: string;
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  experience: Array<{
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  languages: Array<{
    language: string;
    level: string;
  }>;
  summary: string;
  selectedOfferId: number | null;
}

const defaultCVData: CVData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: ""
  },
  experience: [{
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  }],
  education: [{
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  }],
  skills: {
    technical: [],
    soft: []
  },
  languages: [{
    language: "",
    level: ""
  }],
  summary: "",
  selectedOfferId: null
}

export default function CreatorPage() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [offers, setOffers] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<string>("personal")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Pobierz zapisane oferty i CV przy pierwszym renderowaniu
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      // Pobierz oferty
      const { data: offersData } = await supabase
        .from('offers')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })

      if (offersData) setOffers(offersData)

      // Pobierz ostatnie CV
      const { data: cvData } = await supabase
        .from('cv_data')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (cvData) {
        // Głębokie mergowanie danych z zachowaniem struktury
        const mergedData = {
          ...defaultCVData,
          ...cvData,
          personal: {
            ...defaultCVData.personal,
            ...cvData.personal
          },
          experience: cvData.experience?.length ? cvData.experience.map((exp: any) => ({
            ...defaultCVData.experience[0],
            ...exp
          })) : defaultCVData.experience,
          education: cvData.education?.length ? cvData.education.map((edu: any) => ({
            ...defaultCVData.education[0],
            ...edu
          })) : defaultCVData.education,  
          skills: {
            ...defaultCVData.skills,
            ...cvData.skills
          },
          languages: cvData.languages?.length ? cvData.languages.map((lang: any) => ({
            ...defaultCVData.languages[0],
            ...lang
          })) : defaultCVData.languages,
          selectedOfferId: cvData.selectedOfferId || null
        }
        setCvData(mergedData)
      }
    }

    fetchData()
  }, [])

  // Autosave co 10 sekund
  const saveCV = useCallback(async (data: CVData) => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      const cvToSave = {
        ...data,
        owner: session.user.id,
        updated_at: new Date().toISOString()
      }

      if (data.id) {
        // Update
        await supabase
          .from('cv_data')
          .update(cvToSave)
          .eq('id', data.id)
      } else {
        // Insert
        const { data: newCV } = await supabase
          .from('cv_data')
          .insert([cvToSave])
          .select()
          .single()

        if (newCV) {
          setCvData(prev => ({ ...prev, id: newCV.id }))
        }
      }

      toast({
        title: "Zapisano zmiany",
        duration: 2000
      })
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error)
      toast({
        title: "Błąd podczas zapisywania",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }, [toast])

  const debouncedSave = useCallback(
    debounce((data: CVData) => saveCV(data), 10000),
    [saveCV]
  )

  // Wywołaj autosave przy każdej zmianie danych
  useEffect(() => {
    if (cvData !== defaultCVData) {
      debouncedSave(cvData)
    }
  }, [cvData, debouncedSave])

  // Funkcja do optymalizacji tekstu przez AI
  const optimizeText = async (text: string, field: string) => {
    try {
      const response = await fetch('/api/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, field })
      })
      
      if (!response.ok) throw new Error('Błąd optymalizacji tekstu')
      
      const { optimizedText } = await response.json()
      return optimizedText
    } catch (error) {
      console.error('Błąd podczas optymalizacji:', error)
      toast({
        title: "Błąd optymalizacji tekstu",
        variant: "destructive"
      })
      return text
    }
  }

  const handleOptimize = async (field: string, value: string) => {
    if (!cvData.selectedOfferId) {
      toast({
        title: "Wybierz ofertę pracy",
        description: "Aby zoptymalizować tekst, najpierw wybierz ofertę pracy",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: value, 
          field, 
          offerId: cvData.selectedOfferId 
        })
      })
      
      if (!response.ok) throw new Error('Błąd optymalizacji tekstu')
      
      const { optimizedText } = await response.json()
      if (optimizedText) {
        // Zaktualizuj odpowiednie pole w CV
        if (field.startsWith('experience.')) {
          const [, indexStr, property] = field.split('.')
          const index = parseInt(indexStr)
          setCvData(prev => ({
            ...prev,
            experience: prev.experience.map((item, i) => 
              i === index ? { ...item, [property]: optimizedText } : item
            )
          }))
        } else {
          setCvData(prev => ({
            ...prev,
            [field]: optimizedText
          }))
        }

        toast({
          title: "Tekst zoptymalizowany",
          description: "Tekst został dostosowany do wybranej oferty pracy",
        })
      }
    } catch (error) {
      console.error('Błąd podczas optymalizacji:', error)
      toast({
        title: "Błąd optymalizacji tekstu",
        description: "Nie udało się zoptymalizować tekstu",
        variant: "destructive"
      })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Lewa kolumna - formularze */}
          <div className="w-1/2 p-6 overflow-y-auto border-r">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kreator CV</h1>
                {isSaving && <span className="text-sm text-gray-500">Zapisywanie...</span>}
              </div>

              {/* Wybór oferty */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Wybierz ofertę pracy</label>
                <Select
                  value={cvData.selectedOfferId?.toString() || ""}
                  onValueChange={(value) => {
                    setCvData(prev => ({
                      ...prev,
                      selectedOfferId: value ? parseInt(value) : null
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz ofertę..." />
                  </SelectTrigger>
                  <SelectContent>
                    {offers.map((offer) => (
                      <SelectItem key={offer.id} value={offer.id.toString()}>
                        {offer.position} - {offer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Nawigacja sekcji */}
              <div className="flex space-x-2">
                {["personal", "experience", "education", "skills", "languages", "summary"].map((section) => (
                  <Button
                    key={section}
                    variant={activeSection === section ? "default" : "outline"}
                    onClick={() => setActiveSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Formularze */}
              <div className="space-y-6">
                {activeSection === "personal" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Dane osobowe</h2>
                    <Input
                      placeholder="Imię i nazwisko"
                      value={cvData.personal.name}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={cvData.personal.email}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Telefon"
                      value={cvData.personal.phone}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Lokalizacja"
                      value={cvData.personal.location}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                    />
                  </div>
                )}

                {activeSection === "experience" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Doświadczenie</h2>
                    {cvData.experience.map((exp, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex justify-between">
                          <h3>Doświadczenie {index + 1}</h3>
                          {index > 0 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setCvData(prev => ({
                                ...prev,
                                experience: prev.experience.filter((_, i) => i !== index)
                              }))}
                            >
                              Usuń
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Stanowisko"
                          value={exp.position}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            experience: prev.experience.map((item, i) => 
                              i === index ? { ...item, position: e.target.value } : item
                            )
                          }))}
                        />
                        <Input
                          placeholder="Firma"
                          value={exp.company}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            experience: prev.experience.map((item, i) => 
                              i === index ? { ...item, company: e.target.value } : item
                            )
                          }))}
                        />
                        <div className="flex gap-4">
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => setCvData(prev => ({
                              ...prev,
                              experience: prev.experience.map((item, i) => 
                                i === index ? { ...item, startDate: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => setCvData(prev => ({
                              ...prev,
                              experience: prev.experience.map((item, i) => 
                                i === index ? { ...item, endDate: e.target.value } : item
                              )
                            }))}
                          />
                        </div>
                        <div className="relative">
                          <Textarea
                            placeholder="Opis stanowiska"
                            value={exp.description}
                            onChange={(e) => setCvData(prev => ({
                              ...prev,
                              experience: prev.experience.map((item, i) => 
                                i === index ? { ...item, description: e.target.value } : item
                              )
                            }))}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-2"
                            onClick={() => handleOptimize(`experience.${index}.description`, exp.description)}
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => setCvData(prev => ({
                        ...prev,
                        experience: [...prev.experience, {
                          position: "",
                          company: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          description: ""
                        }]
                      }))}
                    >
                      Dodaj doświadczenie
                    </Button>
                  </div>
                )}

                {/* Podobne sekcje dla education, skills, languages i summary */}
              </div>
            </div>
          </div>

          {/* Prawa kolumna - podgląd */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white">
            <div className="max-w-[21cm] mx-auto bg-white shadow-lg p-8">
              {/* Sekcja danych osobowych */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{cvData.personal.name || "Imię i Nazwisko"}</h1>
                <div className="text-gray-600">
                  {cvData.personal.email && <div>{cvData.personal.email}</div>}
                  {cvData.personal.phone && <div>{cvData.personal.phone}</div>}
                  {cvData.personal.location && <div>{cvData.personal.location}</div>}
                </div>
              </div>

              {/* Sekcja doświadczenia */}
              {cvData.experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">Doświadczenie zawodowe</h2>
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <div className="text-gray-600">{exp.company}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate || "obecnie"}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Podobne sekcje dla education, skills, languages */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
