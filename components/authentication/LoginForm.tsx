'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

const redirectBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Funkcja do logowania i generowania tokena JWT
  // async function loginAndFetchToken() {
  //   try {
  //     // Pobierz token Supabase z ciasteczka
  //     const cookies = document.cookie.split(';');
  //     let supabaseToken = '';
      
  //     for (const cookie of cookies) {
  //       const [name, value] = cookie.trim().split('=');
  //       if (name === 'sb-glhmchjlnjovpzcnqaaf-auth-token.0' || name === 'sb-glhmchjlnjovpzcnqaaf-auth-token.1') {
  //         try {
  //           const parsedValue = JSON.parse(decodeURIComponent(value));
  //           supabaseToken = parsedValue.access_token;
  //           break;
  //         } catch (e) {
  //           console.error('Błąd parsowania ciasteczka:', e);
  //         }
  //       }
  //     }

  //     if (!supabaseToken) {
  //       throw new Error('Nie znaleziono tokenu Supabase');
  //     }

  //     const response = await fetch("/api/auth/generate-jwt", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ supabaseToken }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Nie udało się wygenerować tokenu JWT");
  //     }

  //     const data = await response.json();
  //     localStorage.setItem("jwt", data.token); // Zapisujemy JWT w localStorage
  //     toast.success('Token JWT wygenerowany i zapisany!');
  //   } catch (error) {
  //     console.error("Error generating JWT:", error);
  //     toast.error("Nie udało się wygenerować tokenu JWT.");
  //   }
  // }

  // Obsługa logowania
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Logowanie użytkownika przez Supabase
      const supabase = createClient();
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !user) {
        throw new Error(error?.message || "Niepoprawne dane logowania");
      }
      
      // Zapisz token w localStorage
      localStorage.setItem('supabase_access_token', user.session.access_token);
      localStorage.setItem('supabase_refresh_token', user.session.refresh_token);
      // Przekierowanie do dashboardu
      toast.success("Logowanie udane!");
      router.push("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError("Wystąpił błąd podczas logowania.");
    } finally {
      setIsLoading(false);
       
    }
  }

  // Obsługa logowania przez Google OAuth
  async function handleGoogleLogin() {
    const supabase = createClient();
    const redirectTo = `${redirectBaseUrl}/auth/callback`;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        console.error("Google login error:", error.message);
        toast.error("Błąd logowania przez Google: " + error.message);
        return;
      }

  
      if (data.url) {
        window.location.href = data.url; // Przekierowanie na stronę logowania Google
      }
    } catch (error) {
      console.error("Unexpected Google login error:", error);
      toast.error("Wystąpił nieoczekiwany błąd podczas logowania przez Google.");
    }
  }

  return (
    <form className={`flex flex-col gap-6 ${className}`} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-2xl font-bold">Zaloguj się do konta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Wprowadź swój email, aby zalogować się do konta
        </p>
      </div>
      {formError && <p className="text-red-500 text-center">{formError}</p>}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@przykład.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Hasło</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Ładowanie...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Zaloguj z Google
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
