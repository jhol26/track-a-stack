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

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 border-r bg-gradient-to-b from-[#059669] to-[#047857] min-h-screen p-4">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-white">
          Vestro
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-[#d97706] text-white font-medium hover:bg-[#b45309]",
                  !isActive && "text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
