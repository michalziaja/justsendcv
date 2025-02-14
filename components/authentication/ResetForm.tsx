'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export function ResetForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get('email') as string
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        toast.error('Błąd resetowania hasła: ' + error.message)
        return
      }

      toast.success('Sprawdź swoją skrzynkę email, aby zresetować hasło.')
    } catch (error) {
      toast.error('Wystąpił błąd podczas resetowania hasła')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-center">Zresetuj hasło</h1>
      <div className="grid gap-5">
        <Label htmlFor="email">Wpisz email podany przy rejestracji aby zresetować hasło:</Label>
      </div>
      <div>
        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Wysyłanie...' : 'Zresetuj hasło'}
      </Button>
    </form>
  )
} 