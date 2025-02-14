"use client"

import { BookmarkIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2Icon } from "lucide-react"

export function GoalCard() {
  const [savedOffers, setSavedOffers] = useState(0)
  const [sentOffers, setSentOffers] = useState(0)
  const [goal, setGoal] = useState<number>(0)
  const [newGoal, setNewGoal] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (goal !== null) {
      setNewGoal(goal.toString())
    }
  }, [goal])

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return

    // Pobierz cel z profilu
    const { data: profile } = await supabase
      .from('profile')
      .select('goal')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.goal) {
      setGoal(profile.goal)
    }

    // Pobierz oferty z tego tygodnia
    const startOfWeek = new Date()
    startOfWeek.setHours(0,0,0,0)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

    const { data: offers } = await supabase
      .from('offers')
      .select('status, created_at')
      .eq('owner', session.user.id)
      .gte('created_at', startOfWeek.toISOString())

    if (offers) {
      setSavedOffers(offers.length)
      setSentOffers(offers.filter(o => o.status === 'Wysłana').length)
    }
  }

  const handleSaveGoal = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return

    const newGoalNumber = parseInt(newGoal)
    if (isNaN(newGoalNumber) || newGoalNumber < 0) {
      alert('Proszę podać prawidłową liczbę')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('profile')
      .update({ goal: newGoalNumber })
      .eq('user_id', session.user.id)

    if (!error) {
      setGoal(newGoalNumber)
      setNewGoal('')
    }

    setLoading(false)
    await fetchData()
  }

  const progress = goal > 0 ? (sentOffers / goal) * 100 : 0

  return (
    <Card className="p-4 shadow-xl border-2 h-[400px]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="ml-4 text-2xl font-bold text-gray-800">Wysłane</h2>
        {/* <h2 className="text-2xl mr-4 font-extrabold text-black-800">{savedOffers}</h2> */}
        <div className="p-2 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] rounded-lg mr-2">
          <BookmarkIcon className="h-8 w-8 text-white" />
        </div>
        
        
      </div>

      <Separator className="mb-3 mt-3" />
      <div className="flex flex-col text-lg text-gray-700 items-center ">
          {/* Wysłane oferty w tym tygodniu */}
        </div>
      <div className="flex flex-col items-center justify-center flex-1 h-[180px]">
        
        <div className="absolute w-40 h-40 mt-10 mb-0">
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            <circle
              className="text-gray-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="43"
              cx="50"
              cy="50"
            />
            <circle
              className="text-[#20b5fa]"
              strokeWidth="12"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 * (1 - progress / 100)}
              strokeLinecap="round"
              stroke="url(#blue-gradient)"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              transform="rotate(-80 50 50)"
            />
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#20b5fa" />
                <stop offset="100%" stopColor="#1995ce" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold">
              <span className="text-[#1995ce]">{sentOffers}</span>
              <span className="text-gray-700"> z {goal}</span>
            </div>
          </div>
        </div>

        
      </div>

      <div className="flex items-center justify-evenly mb-0 mt-10 h-[90px]">
        <div className="flex items-center">
          <div className="text-base font-bold text-gray-800 mr-8">
            Cel tygodniowy:
          </div>
          <Input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="h-10 w-20 font-extrabold text-2xl mr-8 text-center text-[#1995ce]"
          />
        </div>
        <Button 
          onClick={handleSaveGoal} 
          disabled={loading}
          className="h-9 bg-gradient-to-r from-[#20b5fa] to-[#1995ce] hover:opacity-90 text-white font-medium text-sm shadow-md"
        >
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </div>
    </Card>
  )
} 