"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CalendarNote } from "@/components/dashboard/calendar-note"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Eye, Trash2, Download } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/components/ui/use-toast"

interface CV {
  id: number
  owner: string
  created_at: string
  filename: string
  file_url: string
  file_path: string
}

export default function CVPage() {
  const [cvList, setCVList] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Błąd podczas pobierania CV:', error.message)
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy CV",
          variant: "destructive",
        })
      }

      setCVList(data || [])
    } catch (err) {
      console.log('Info: Brak danych CV')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Nie jesteś zalogowany');
      }

      // Sprawdź rozmiar pliku (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Plik jest zbyt duży. Maksymalny rozmiar to 10MB');
      }

      // Sprawdź rozszerzenie pliku
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['pdf', 'docx'].includes(fileExt)) {
        throw new Error('Nieobsługiwany format pliku. Dozwolone formaty to PDF i DOCX');
      }

      // Generuj unikalną nazwę pliku
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      console.log('Rozpoczynam upload pliku:', {
        fileName,
        fileSize: file.size,
        fileType: file.type
      });

      // Upload pliku do Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('cv-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Błąd podczas uploadowania do storage:', storageError);
        throw new Error(`Błąd podczas uploadowania pliku: ${storageError.message}`);
      }

      console.log('Plik został uploadowany:', storageData);

      // Pobierz publiczny URL pliku
      const { data: { publicUrl } } = supabase
        .storage
        .from('cv-files')
        .getPublicUrl(fileName);

      console.log('Uzyskano publiczny URL:', publicUrl);

      // Zapisz informacje w bazie danych
      const { data: cvData, error: dbError } = await supabase
        .from('cv_data')
        .insert([
          {
            owner: session.user.id,
            filename: file.name,
            file_url: publicUrl,
            file_path: fileName
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Błąd podczas zapisywania w bazie:', dbError);
        throw new Error(`Błąd podczas zapisywania w bazie: ${dbError.message}`);
      }

      console.log('Zapisano dane w bazie:', cvData);

      // Przetwórz CV przez API
      const response = await fetch('/api/process-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv_text: "Example CV text for testing", // Tymczasowo używamy przykładowego tekstu
          user_id: session.user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Błąd odpowiedzi API:', errorData);
        throw new Error(`Błąd podczas przetwarzania CV: ${errorData.error || response.statusText}`);
      }

      const processedData = await response.json();
      console.log('CV zostało przetworzone:', processedData);
      
      setCVList(prev => [cvData, ...prev]);
      setSelectedFile(cvData.id.toString());

      toast({
        title: "Sukces",
        description: "CV zostało przesłane i przetworzone pomyślnie",
      });
    } catch (error) {
      console.error('Szczegóły błędu:', error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd podczas przesyłania CV",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const supabase = createClient();
      const cv = cvList.find(cv => cv.id.toString() === fileId);

      if (cv?.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('cv-files')
          .remove([cv.file_path]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('cv_data')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      setCVList(prev => prev.filter(f => f.id.toString() !== fileId));
      if (selectedFile === fileId) {
        setSelectedFile(null);
      }

      toast({
        title: "CV zostało usunięte",
      });
    } catch (error) {
      console.error('Błąd podczas usuwania CV:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć CV",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [])

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
        <div className="max-w-7xl mx-auto px-4 mt-8 sm:px-6 lg:px-8 w-full">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Lewa kolumna - upload i lista */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Górna część - upload */}
              <div className="p-6 border-b border-gray-200">
                <Card 
                  className={`p-6 ${isDragging ? 'border-2 border-dashed border-purple-600' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isDragging ? 'bg-purple-200' : 'bg-purple-100'
                    }`}>
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-700' : 'text-purple-600'}`} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold mb-1">
                        {isDragging ? 'Upuść plik tutaj' : 'Prześlij swoje CV'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Przeciągnij i upuść plik lub kliknij aby wybrać
                      </p>
                      <p className="text-xs text-gray-400">
                        Obsługiwane formaty: PDF, DOCX
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                    />
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? 'Przesyłanie...' : 'Wybierz plik'}
                    </Button>
                  </div>
                </Card>
              </div>
              
              {/* Lista CV */}
              <div className="flex-1 overflow-auto p-6">
                <h3 className="font-semibold mb-4">Twoje dokumenty CV</h3>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">Ładowanie...</div>
                  ) : cvList.length > 0 ? (
                    cvList.map((cv) => (
                      <Card
                        key={cv.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedFile === cv.id.toString() ? 'border-purple-600' : ''
                        }`}
                        onClick={() => setSelectedFile(cv.id.toString())}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium">{cv.filename || 'Dokument CV'}</p>
                              <p className="text-sm text-gray-500">
                                Dodano: {new Date(cv.created_at).toLocaleDateString('pl-PL')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFileDelete(cv.id.toString())
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nie masz jeszcze żadnych dokumentów CV
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prawa kolumna - podgląd */}
            <div className="flex-1 p-6 bg-gray-50">
              {selectedFile ? (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-6">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        const cv = cvList.find(cv => cv.id.toString() === selectedFile)
                        if (cv?.file_url) {
                          window.open(cv.file_url, '_blank')
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Pobierz CV
                    </Button>
                  </div>
                  <Card className="h-[calc(100%-4rem)] overflow-auto">
                    {cvList.find(cv => cv.id.toString() === selectedFile)?.file_url && (
                      <iframe
                        src={cvList.find(cv => cv.id.toString() === selectedFile)?.file_url}
                        className="w-full h-full"
                        title="CV Preview"
                      />
                    )}
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Wybierz plik CV aby zobaczyć podgląd
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}