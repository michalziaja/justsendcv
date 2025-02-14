"use client"

import { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown, Trash2, FileText, Globe, FileSearch } from "lucide-react"
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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from '@/utils/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Drawer } from "@/components/ui/drawer"
import Image from "next/image"
import { CalendarNote } from "@/components/dashboard/calendar-note"

// Typ danych dla zapisanej oferty
type SavedJob = {
  id: number
  position: string
  company: string
  site: string
  url: string
  created_at: string
  status: string
  status_changed: string
  requirements: string
  responsibilities: string
  full_text: string
  note: string | null
}

// Typ danych dla CV
// type ProcessedCVData = {
//   id: string
//   created_at: string
//   displayName: string
// }

// type CVData = {
//   id: string
//   created_at: string
//   experience: Array<{
//     position: string
//     company: string
//     date: string
//   }>
// }

export default function SavedPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<SavedJob[]>([])
  // const [cvList, setCvList] = useState<ProcessedCVData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('Błąd sesji:', sessionError)
          return
        }

        // Pobierz zapisane oferty
        const { data: savedJobs, error: jobsError } = await supabase
          .from('offers')
          .select('*')
          .eq('owner', session.user.id)
          .order('created_at', { ascending: false })

        if (jobsError) {
          console.error('Error fetching saved jobs:', jobsError.message)
          return
        }

        // // Pobierz zapisane CV
        // const { data: cvData, error: cvError } = await supabase
        //   .from('cv_data')
        //   .select('id, created_at, experience')
        //   .eq('owner', session.user.id)
        //   .order('created_at', { ascending: false })

        // if (cvError) {
        //   console.error('Error fetching CV data:', cvError.message)
        //   return
        // }

        setData(savedJobs || [])
        // // Przetwórz dane CV, aby utworzyć nazwę na podstawie ostatniego doświadczenia
        // const processedCvData = (cvData || []).map(cv => {
        //   const experience = cv.experience as Array<{position: string, company: string, date: string}> || []
        //   const lastJob = experience && experience.length > 0 ? experience[0] : null
        //   return {
        //     id: cv.id,
        //     created_at: cv.created_at,
        //     displayName: lastJob?.position ? 
        //       `CV - ${lastJob.position} (${lastJob.company})` : 
        //       `CV #${cv.id}`
        //   }
        // })
        // setCvList(processedCvData)
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStatusChange = async (jobId: number, newStatus: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('Brak sesji użytkownika')
        return
      }

      // Pobierz aktualny status oferty
      const { data: currentOffer } = await supabase
        .from('offers')
        .select('status')
        .eq('id', jobId)
        .single()

      const oldStatus = currentOffer?.status

      // Aktualizuj status i status_changed w tabeli offers
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: newStatus,
          status_changed: new Date().toISOString()
        })
        .eq('id', jobId)

      if (updateError) throw updateError

      // Dodaj wpis do historii zmian
      const { error: historyError } = await supabase
        .from('offer_status_history')
        .insert({
          offer_id: jobId,
          old_status: oldStatus,
          new_status: newStatus,
          changed_by: session.user.id
        })

      if (historyError) throw historyError

      // Odśwież dane w tabeli
      setData(data.map(job => 
        job.id === jobId ? { 
          ...job, 
          status: newStatus,
          status_changed: new Date().toISOString()
        } : job
      ))
    } catch (err) {
      console.error('Błąd podczas aktualizacji statusu:', err)
    }
  }

  const handleDelete = async (jobId: number) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', jobId)

      if (error) throw error

      // Usuń ofertę z tabeli
      setData(data.filter(job => job.id !== jobId))
    } catch (err) {
      console.error('Błąd podczas usuwania oferty:', err)
    }
  }

  const columns: ColumnDef<SavedJob>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => {
        return <span className="text-gray-600">{row.index + 1}</span>
      },
      size: 40,
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer hover:text-[#1995ce] text-lg font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stanowisko
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-900 font-medium">
            {row.getValue("position")}
          </span>
        )
      },
      size: 330,
    },
    {
      accessorKey: "url",
      header: ({ column }) => {
        return (
          <div className="text-lg font-bold">
            Link
          </div>
        )
      },
      cell: ({ row }) => {
        const site = row.original.site.toLowerCase()
        const url = row.original.url
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="mr-8 flex justify-center">
            {site.includes('pracuj.pl') ? (
              <Image
                src="/pracuj.png"
                alt="Pracuj.pl"
                width={24}
                height={24}
                className="hover:opacity-80"
              />
            ) : site.includes('nofluffjobs') ? (
              <Image
                src="/nofluffjobs.png"
                alt="NoFluffJobs"
                width={24}
                height={24}
                className="hover:opacity-80"
              />
            ) : site.includes('gowork') ? (
              <Image
                src="/gowork.png"
                alt="GoWork.pl"
                width={24}
                height={24}
                className="hover:opacity-80"
              />
            ) : site.includes('rocketjobs') ? (
                <Image
                  src="/rocketjobs.png"
                  alt="RocketJobs"
                  width={24}
                  height={24}
                  className="hover:opacity-80"
                />
            ) : site.includes('linkedin') ? (
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="hover:opacity-80"
                />
            ) : site.includes('indeed') ? (
                <Image
                  src="/indeed.png"
                  alt="Indeed"
                  width={24}
                  height={24}
                  className="hover:opacity-80"
                />
            ) : site.includes('justjoin.it') ? (
              <Image
                src="/justjoin.png"
                alt="JustJoinIT"
                width={24}
                height={24}
                className="hover:opacity-80"
              />
            ) : (
              <Globe className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            )}
          </a>
        )
      },
      size: 50,
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer hover:text-[#1995ce] text-lg font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Firma
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-700">
            {row.getValue("company")}
          </span>
        )
      },
      size: 210,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer hover:text-[#1995ce] text-lg font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
          </div>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusStyles = {
          Zapisana: "bg-blue-100 text-blue-700",
          Wysłana: "bg-purple-100 text-purple-700",
          Kontakt: "bg-green-100 text-green-700",
          Rozmowa: "bg-yellow-100 text-yellow-700",
          Odmowa: "bg-red-100 text-red-700",
          Oferta: "bg-emerald-100 text-emerald-700",
        }
        return (
          <Select
            defaultValue={status}
            onValueChange={(value) => handleStatusChange(row.original.id, value)}
          >
            <SelectTrigger className={`w-[150px] h-7 text-sm ${statusStyles[status as keyof typeof statusStyles]} font-medium`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Zapisana" className="bg-blue-50 text-blue-700 text-sm h-8 font-medium">Zapisana</SelectItem>
              <SelectItem value="Wysłana" className="bg-purple-50 text-purple-700 text-sm h-8 font-medium">Wysłana</SelectItem>
              <SelectItem value="Kontakt" className="bg-green-50 text-green-700 text-sm h-8 font-medium">Kontakt</SelectItem>
              <SelectItem value="Rozmowa" className="bg-yellow-50 text-yellow-700 text-sm h-8 font-medium">Rozmowa</SelectItem>
              <SelectItem value="Odmowa" className="bg-red-50 text-red-700 text-sm h-8 font-medium">Odmowa</SelectItem>
              <SelectItem value="Oferta" className="bg-emerald-50 text-emerald-700 text-sm h-8 font-medium">Oferta</SelectItem>
            </SelectContent>
          </Select>
        )
      },
      size: 200
    },
    {
      accessorKey: "status_changed",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer hover:text-[#1995ce] text-lg font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Zmiana statusu
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-600 font-medium">
            {new Date(row.getValue("status_changed")).toLocaleDateString('pl-PL')}
          </span>
        )
      },
      size: 180
    },
    {
      accessorKey: "info",
      header: "",
      cell: ({ row }) => {
        return (
            <FileSearch className="h-6 w-6 cursor-pointer hover:text-[#1995ce] transition-colors" onClick={() => setSelectedJob(row.original)} />
        )
      },
      size: 70,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer hover:text-[#1995ce] text-lg font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-600 font-medium">
            {new Date(row.getValue("created_at")).toLocaleDateString('pl-PL')}
          </span>
        )
      },
      size: 100,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )
      },
      size: 50,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 13,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  })

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          <header className="flex h-16 shrink-0 items-center border-b border-gray-100/50 bg-gray-50">
            <div className="flex items-center gap-8 ml-4">
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <CalendarNote />
          </header>
          <div className="h-[400px] flex flex-1 flex-col mt-4 gap-1 p-4 bg-gray-50 ml-2 mr-2">
            <div className="flex flex-col gap-1">
              <div className="relative rounded-xl bg-white shadow-xl">
                <div className="animate-pulse p-4">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-8 w-[250px] bg-gray-200 rounded"></div>
                    <div className="flex-1"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                  </div>
                  {/* Table rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4 border-t border-gray-100">
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      <div className="w-64 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="w-48 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-8 bg-gray-200 rounded"></div>
                      <div className="w-40 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50 p-0">
        <header className="flex h-16 shrink-0 items-center border-b border-gray-100/50 bg-gray-50">
          <div className="flex items-center gap-1 ml-1 mt-8">
            <Separator orientation="vertical" className="mr-2 ml-2 h-4" />
            <Input
              placeholder="Wyszukaj ofertę..."
              value={(table.getColumn("position")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("position")?.setFilterValue(event.target.value)
              }
              className="w-[250px]"
            />
          </div>
          <CalendarNote />
        </header>
        <div className="h-[400px] flex flex-1 flex-col mt-4 gap-1 p-4 bg-gray-50 ml-2 mr-2">
          <div className="flex flex-col gap-1">
            <div className="relative rounded-xl bg-white shadow-xl">
              <Table className="rounded-xl">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gray-50/95 hover:bg-gray-100/95 transition-colors">
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead 
                            key={header.id}
                            style={{ width: header.column.getSize() }}
                            className="font-medium text-gray-900 py-5"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="h-12 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell 
                              key={cell.id}
                              style={{ width: cell.column.getSize() }}
                              className="py-1.5"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {Array.from({ length: 14 - table.getRowModel().rows.length }).map((_, index) => (
                        <TableRow key={`empty-${index}`} className="h-12 border-t border-gray-100">
                          {columns.map((column, cellIndex) => (
                            <TableCell 
                              key={`empty-cell-${cellIndex}`}
                              style={{ width: column.size }}
                            >
                              &nbsp;
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-[576px] text-center text-gray-500"
                      >
                        Brak zapisanych ofert.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-[#1995ce] border-purple-200 hover:bg-purple-50 hover:text-[#1995ce] transition-all"
              >
                Poprzednia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-[#1995ce] border-purple-200 hover:bg-purple-50 hover:text-[#1995ce] transition-all"
              >
                Następna
              </Button>
            </div>
          </div>
        </div>
        <Drawer 
          open={!!selectedJob} 
          onClose={() => setSelectedJob(null)}
          selectedJob={selectedJob}
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{selectedJob?.position}</h2>
              <p className="text-lg text-gray-600">{selectedJob?.company}</p>
            </div>
            {selectedJob?.responsibilities && (
              <div>
                <h3 className="font-semibold mb-2">Zakres obowiązków</h3>
                <p className="whitespace-pre-wrap">{selectedJob.responsibilities}</p>
              </div>
            )}
            {selectedJob?.requirements && (
              <div>
                <h3 className="font-semibold mb-2">Wymagania</h3>
                <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>
            )}
          </div>
        </Drawer>
      </SidebarInset>
    </SidebarProvider>
  )
} 