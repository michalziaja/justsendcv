"use client"

import { CalendarIcon, Trash2Icon } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { pl } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns'

interface CalendarNotes {
  [date: string]: string;
}

interface PopoverContentProps {
  dayDate: Date;
  notes: CalendarNotes;
  setNotes: React.Dispatch<React.SetStateAction<CalendarNotes>>;
  handleSaveNote: (dateToSave: Date, noteText: string) => Promise<void>;
  setEditingDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const PopoverContentComponent: React.FC<PopoverContentProps> = ({
  dayDate,
  notes,
  setNotes,
  handleSaveNote,
  setEditingDate,
}) => {
  const dateKey = format(dayDate, "yyyy-MM-dd");
  const [localNote, setLocalNote] = useState(notes[dateKey] || "");

  useEffect(() => {
    setLocalNote(notes[dateKey] || "");
  }, [dayDate, notes]);

  return (
    <PopoverContent
      className="w-80 p-3"
      side="left"
      align="center"
      sideOffset={16}
      avoidCollisions={false}
      forceMount
      onOpenAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <div className="font-medium">
          {format(dayDate, "d MMMM yyyy", { locale: pl })}
        </div>
        <Textarea
          placeholder="Wpisz notatkę (max 100 znaków)"
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value.slice(0, 100))}
          className="resize-none min-h-[80px]"
          autoFocus
          onBlur={() => {
            if (localNote.trim() !== notes[dateKey]?.trim()) {
              handleSaveNote(dayDate, localNote);
            }
            setEditingDate(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditingDate(null);
            }
          }}
        />
        <div className="text-right text-sm text-gray-500">
          {localNote.length}/100 znaków
        </div>
      </div>
    </PopoverContent>
  );
};

export function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState<CalendarNotes>({})
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingDate, setEditingDate] = useState<Date | null>(null)

  const loadNotes = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setIsLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profile')
      .select('calendar')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.calendar) {
      try {
        const parsedCalendar = typeof profile.calendar === 'string'
          ? JSON.parse(profile.calendar)
          : profile.calendar

        const cleanNotes: CalendarNotes = {}
        Object.entries(parsedCalendar).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim()) {
            cleanNotes[key] = value.trim()
          }
        })

        setNotes(cleanNotes)
      } catch (error) {
        console.error('Błąd parsowania notatek:', error)
        setNotes({})
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setEditingDate(newDate)
    }
  }

  const handleSaveNote = async (dateToSave: Date, noteText: string) => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setLoading(false)
      return
    }

    const dateKey = format(dateToSave, 'yyyy-MM-dd')
    const updatedNotes = { ...notes }

    if (noteText.trim() === '') {
      delete updatedNotes[dateKey]
    } else {
      updatedNotes[dateKey] = noteText.trim()
    }

    const { error } = await supabase
      .from('profile')
      .update({
        calendar: updatedNotes
      })
      .eq('user_id', session.user.id)

    if (!error) {
      setNotes(updatedNotes)
    } else {
      console.error('Błąd zapisu notatki:', error)
    }

    setLoading(false)
    setEditingDate(null)
  }

  if (isLoading) {
    return (
      <Card className="p-3 shadow-xl border-2">
        <div className="mt-8 flex justify-center items-center h-[300px]">
          Ładowanie...
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5 shadow-xl border-2 h-[400px]">
      <div className="mt-4 mb-4 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={pl}
          className="rounded-md ml-2 mt-4 [&_.rdp-day]:!bg-transparent [&_.rdp-day_button]:!bg-transparent [&_.rdp-button]:hover:!bg-purple-50 [&_.rdp-day_button]:!border-0 [&_.rdp-button]:!bg-transparent [&_table_td]:!bg-transparent [&_table_td]:!p-0 [&_table]:!border-spacing-0 [&_thead_th]:!w-[14%] !px-1 [&_.rdp-head_row]:!gap-0"
          style={{ transform: "scale(1.2)", width: "300px", height: "300px" }}
          modifiers={{
            hasNote: (date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              return !!notes[dateKey];
            },
            today: (date) => {
              return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            },
            outside: () => false,
          }}
          modifiersStyles={{
            hasNote: {
              fontWeight: "bold",
              color: "#9333ea",
              textDecoration: "underline",
            },
            today: {
              border: "2px solid #6366f1",
              borderRadius: "6px",
              fontWeight: "bold",
              backgroundColor: "#f3f4f6",
              color: "#4f46e5"
            }
          }}
          components={{
            Day: ({ date: dayDate, ...props }) => {
              const dateKey = format(dayDate, "yyyy-MM-dd");
              const hasNote = !!notes[dateKey];
              const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const isEditing =
                editingDate && format(editingDate, "yyyy-MM-dd") === dateKey;

              const commonButtonProps = {
                className: `w-9 h-7 flex items-center mr-1 justify-center cursor-pointer rounded-md ${
                  hasNote
                    ? "font-medium text-white mr-1 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] hover:opacity-90"
                    : isToday
                    ? "font-bold text-indigo-600 bg-gray-100 border-2 border-indigo-500"
                    : "hover:bg-purple-50"
                }`,
                children: (
                  <time dateTime={format(dayDate, "yyyy-MM-dd")}>
                    {dayDate.getDate()}
                  </time>
                ),
                role: "button",
                "aria-selected": false,
                "aria-disabled": false,
                tabIndex: 0,
              };

              if (isEditing) {
                return (
                  <div className="relative">
                    <Popover
                      open={true}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingDate(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          {...commonButtonProps}
                          className={`${commonButtonProps.className} hover:bg-purple-50`}
                          onClick={(e) => e.preventDefault()}
                        />
                      </PopoverTrigger>
                      <PopoverContentComponent
                        dayDate={dayDate}
                        notes={notes}
                        setNotes={setNotes}
                        handleSaveNote={handleSaveNote}
                        setEditingDate={setEditingDate}
                      />
                    </Popover>
                  </div>
                );
              }

              if (hasNote) {
                return (
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          {...commonButtonProps}
                          className={`${commonButtonProps.className} hover:bg-purple-50`}
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-3"
                        side="left"
                        align="center"
                        sideOffset={16}
                        avoidCollisions={false}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">
                              {format(dayDate, "d MMMM yyyy", { locale: pl })}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => handleSaveNote(dayDate, "")}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div
                            className="text-sm text-gray-600 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 rounded p-1"
                            onClick={() => handleDateSelect(dayDate)}
                          >
                            {notes[dateKey]}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }

              return (
                <button
                  {...commonButtonProps}
                  onClick={() => handleDateSelect(dayDate)}
                  className={`${commonButtonProps.className} hover:bg-purple-50`}
                />
              );
            },
          }}
        />
      </div>
    </Card>
  )
}