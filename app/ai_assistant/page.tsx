"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Send, Calendar, MessageSquare, FileCheck } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CalendarNote } from "@/components/dashboard/calendar-note";

export default function AIAssistant() {
  const features = [
    {
      title: "Generator CV",
      description: "Stwórz profesjonalne CV dopasowane do stanowiska",
      icon: FileText,
      action: "Generuj CV",
    },
    {
      title: "List Motywacyjny",
      description: "Wygeneruj spersonalizowany list motywacyjny",
      icon: Send,
      action: "Generuj List",
    },
    {
      title: "Przygotowanie do Rozmowy",
      description: "Przygotuj się do rozmowy kwalifikacyjnej z AI",
      icon: Calendar,
      action: "Rozpocznij Przygotowanie",
    },
    {
      title: "Follow-up Email",
      description: "Wygeneruj profesjonalną wiadomość follow-up",
      icon: MessageSquare,
      action: "Generuj Email",
    },
    {
      title: "Negocjacje Oferty",
      description: "Otrzymaj wsparcie w negocjacjach oferty pracy",
      icon: FileCheck,
      action: "Rozpocznij",
    },
  ];

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
        <div className="container mx-auto p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-white rounded-full">
                    <feature.icon className="w-10 h-10 text-[#1995ce]" />
                  </div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                  <p className="text-gray-800">{feature.description}</p>
                  <Button className="w-full mt-4 font-semibold bg-gradient-to-r from-[#20b5fa] to-[#1995ce]">
                    {feature.action}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 