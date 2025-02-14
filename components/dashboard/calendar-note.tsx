"use client"

import { useEffect, useState } from "react"
import { createClient } from '@/utils/supabase/client'

export function CalendarNote() {
  const [note, setNote] = useState<string | null>(null)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })

  useEffect(() => {
    const fetchTodayNote = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const { data: profile } = await supabase
        .from('profile')
        .select('calendar')
        .eq('user_id', session.user.id)
        .single()

      if (profile?.calendar) {
        const calendar = typeof profile.calendar === 'string' 
          ? JSON.parse(profile.calendar) 
          : profile.calendar

        const today = new Date().toISOString().split('T')[0]
        const todayNote = calendar[today]

        if (todayNote) {
          setNote(todayNote)
        } else {
          setNote(null)
        }
      }
    }

    fetchTodayNote()
    const interval = setInterval(fetchTodayNote, 300000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center mt-8 mr-6 ml-auto">
      <div className="flex items-center gap-2">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-md opacity-50" style={{ padding: '1px', margin: '-1px' }} />
          <div className="relative px-3 py-1 rounded-md bg-white">
            <span className="text-[#1995ce] text-lg font-bold">
              {/* <span className="text-gray-900">{formattedDate} - </span>{" "} */}
              {note || "brak notatek"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 