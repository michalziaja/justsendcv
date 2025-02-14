"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: { title: string; url: string }[]
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarMenu className="space-y-2 py-10 px-0">
      {items.map((item) => {
        const isActive = pathname === item.url
        const Icon = item.icon

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={`
                  relative group flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-cyan-100 text-[#1995ce] shadow-md' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 hover:text-gray-900 hover:shadow-sm'
                  }
                  ${isActive ? 'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-4/6 after:bg-gradient-to-b after:from-purple-500 after:to-cyan-500 after:rounded-r-full' : ''}
                `}
              >
                {Icon && (
                  <Icon 
                    className={`transition-colors duration-200
                    ${isActive 
                      ? 'text-[#1995ce]' 
                      : 'text-gray-800'
                    }`}
                    style={{ width: '1.5em', height: '1.5em' }}
                  />
                )}
                <span className={`font-semibold text-[16px] tracking-wide font-sans transition-colors duration-200
                  ${isActive 
                    ? 'text-[#1995ce]' 
                    : ''
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
            {item.items && (
              <div className="ml-6 mt-1 space-y-1">
                {item.items.map((subItem) => (
                  <SidebarMenuButton key={subItem.title} asChild>
                    <Link
                      href={subItem.url}
                      className={`
                        relative block px-4 py-2.5 text-sm rounded-lg transition-all duration-200
                        ${pathname === subItem.url 
                          ? 'bg-gradient-to-r from-purple-100 font-extrabold to-cyan-100 text-[#1995ce] shadow-md pl-5' 
                          : 'text-gray-900'
                        }
                        ${pathname === subItem.url ? 'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-4/6 after:bg-gradient-to-b after:from-purple-500 after:to-cyan-500 after:rounded-r-full' : ''}
                      `}
                    >
                      <span className="font-medium">
                        {subItem.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
