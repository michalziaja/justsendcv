"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default function TrainingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-50">
        <header className="flex h-16 shrink-0 items-center border-b border-gray-100/50 bg-gray-50">
          <div className="flex items-center gap-1 ml-1">
            {/* <Separator orientation="vertical" className="mr-2 ml-2 h-4" /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Kreator CV</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Trening przed rekrutacja</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Tu będzie formularz kreatora CV */}
              <p className="text-gray-600">Funkcjonalność w trakcie implementacji...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
