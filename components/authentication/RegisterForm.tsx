'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/hooks/use-toast"

interface AuthResponse {
  error: null | string,
  success: boolean,
  data: unknown | null;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function register(formdata: FormData): Promise<AuthResponse> {
    const supabase = createClient(); 
    setIsLoading(true);

    try {
      const data = {
        email: formdata.get('email') as string,
        password: formdata.get('password') as string,
        confirmPassword: formdata.get('confirmPassword') as string,
      };

      if (!data.email || !data.password || !data.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Błąd rejestracji",
          description: "Email, hasło i powtórzone hasło są wymagane.",
        });
        setIsLoading(false);
        return { error: 'Email, hasło i powtórzone hasło są wymagane.', success: false, data: null };
      }

      if (data.password !== data.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Błąd rejestracji",
          description: "Hasła muszą być identyczne.",
        });
        setIsLoading(false);
        return { error: 'Hasła muszą być identyczne.', success: false, data: null };
      }

      const { data: registerData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Błąd rejestracji",
          description: error.message,
        });
        setIsLoading(false);
        return { error: error.message, success: false, data: null };
      }

      toast({
        variant: "default",
        title: "Sukces!",
        description: "Zarejestrowano pomyślnie! Sprawdź swoją skrzynkę email.",
      });
      router.push('/login');
      return { error: null, success: true, data: registerData };
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await register(formData);
  }

  return (
    <form className={`flex flex-col gap-6 ${className}`} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-2xl font-bold">Zarejestruj nowe konto</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Wprowadź swoje dane, aby utworzyć nowe konto
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@przykład.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Hasło</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Powtórz hasło</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
        </Button>
      </div>
    </form>
  );
}
