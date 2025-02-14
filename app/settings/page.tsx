"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CalendarNote } from "@/components/dashboard/calendar-note";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Bell, Moon, Globe, Lock, Mail, Trash2, Shield } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyNewsletter: true,
    darkMode: false,
    autoSave: true,
    twoFactorAuth: false,
    publicProfile: true,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-3xl font-bold mb-6">Ustawienia</h1>
          
          {/* Powiadomienia */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Powiadomienia</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">Powiadomienia email</Label>
                  <p className="text-sm text-gray-500">Otrzymuj powiadomienia o nowych ofertach pracy</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSettingChange('emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="font-medium">Powiadomienia push</Label>
                  <p className="text-sm text-gray-500">Otrzymuj powiadomienia w przeglądarce</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleSettingChange('pushNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyNewsletter" className="font-medium">Newsletter tygodniowy</Label>
                  <p className="text-sm text-gray-500">Otrzymuj cotygodniowe podsumowanie najlepszych ofert</p>
                </div>
                <Switch
                  id="weeklyNewsletter"
                  checked={settings.weeklyNewsletter}
                  onCheckedChange={() => handleSettingChange('weeklyNewsletter')}
                />
              </div>
            </div>
          </Card>

          {/* Wygląd */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Wygląd</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="font-medium">Tryb ciemny</Label>
                  <p className="text-sm text-gray-500">Przełącz na ciemny motyw interfejsu</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleSettingChange('darkMode')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave" className="font-medium">Automatyczne zapisywanie</Label>
                  <p className="text-sm text-gray-500">Automatycznie zapisuj zmiany w CV</p>
                </div>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={() => handleSettingChange('autoSave')}
                />
              </div>
            </div>
          </Card>

          {/* Prywatność i Bezpieczeństwo */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Prywatność i Bezpieczeństwo</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth" className="font-medium">Weryfikacja dwuetapowa</Label>
                  <p className="text-sm text-gray-500">Dodatkowe zabezpieczenie logowania</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={() => handleSettingChange('twoFactorAuth')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publicProfile" className="font-medium">Profil publiczny</Label>
                  <p className="text-sm text-gray-500">Pozwól rekruterom zobaczyć Twój profil</p>
                </div>
                <Switch
                  id="publicProfile"
                  checked={settings.publicProfile}
                  onCheckedChange={() => handleSettingChange('publicProfile')}
                />
              </div>
            </div>
          </Card>

          {/* Zarządzanie Kontem */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Zarządzanie Kontem</h2>
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Zmień adres email
              </Button>
              <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Zmień hasło
              </Button>
              <Button variant="destructive" className="w-full md:w-auto flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Usuń konto
              </Button>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 