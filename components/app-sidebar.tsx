"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Bot,
  BookmarkIcon,
  FileText,
  BarChart2,
  UserCircle,
  Settings,
  LogOut,
  PenTool,
  BrainCircuit
} from "lucide-react"
import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Zapisane",
      url: "/saved",
      icon: BookmarkIcon,
    },
    {
      title: "Kreator CV",
      url: "/creator",
      icon: PenTool,
    },
    {
      title: "Twoje CV",
      url: "/cv",
      icon: FileText,
    },
    {
      title: "Trening",
      url: "/training",
      icon: BrainCircuit,
    },
    {
      title: "Asystent AI",
      url: "/ai_assistant",
      icon: Bot,
    },
    {
      title: "Statystyki",
      url: "/statistics",
      icon: BarChart2,
    },
    {
      title: "Profil",
      url: "/profile",
      icon: UserCircle,
    },
    {
      title: "Ustawienia",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#FFFFFF] border-2 shadow-xl"
      {...props}
    >
      <SidebarHeader className="py-0 bg-[#FFFFFF] mt-2">
        <div className="px-4 flex flex-col items-center pt-6 bg-[#FFFFFF]">
          <Image
            src="/logo.png"
            alt="JustSend.cv Logo"
            width={100}
            height={100}
            className="mb-0 sidebar-expanded:w-[40px] sidebar-collapsed:w-[30px] sidebar-collapsed:mb-0"
          />
          {!isCollapsed && (
            <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              JustSend.cv
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2 text-black bg-[#FFFFFF]">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <style jsx global>{`
        .sidebar-nav-item {
          font-weight: 600 !important;
          color: #000000 !important;
        }
        .sidebar-nav-item:hover {
          color: #000000 !important;
        }
        .sidebar-nav-item svg {
          width: 1.5em !important;
          height: 1.5em !important;
          color: #000000 !important;
          opacity: 1 !important;
          stroke-opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        .sidebar-nav-item:not(:hover) svg {
          color: #000000 !important;
          opacity: 1 !important;
          stroke-opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        [data-collapsed="true"] .sidebar-nav-item svg {
          color: #000000 !important;
          opacity: 1 !important;
          stroke-opacity: 1 !important;
          fill-opacity: 1 !important;
        }
      `}</style>
      <SidebarFooter className="border-t border-gray-200 p-4 bg-[#FFFFFF]">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-0full text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut className="h-4 w-1" />
          {!isCollapsed && <span>Wyloguj się</span>}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}