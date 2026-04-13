"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Clock,
  Target,
  FileText,
  Settings,
  LogOut,
  Library,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/hustles", label: "Hustles", icon: Briefcase },
  { href: "/dashboard/transactions", label: "Transactions", icon: DollarSign },
  { href: "/dashboard/time", label: "Time Tracking", icon: Clock },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/taxes", label: "Taxes", icon: FileText },
  { href: "/dashboard/projections", label: "Projections", icon: FileText },
  { href: "/dashboard/resources", label: "Resources", icon: Library },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r bg-gradient-to-b from-[#059669] to-[#047857]">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Track A Stack" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">Track A Stack</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "text-white hover:bg-white/10",
                        isActive && "bg-[#d97706] text-white font-medium hover:bg-[#b45309]"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-white hover:bg-white/10 w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
