"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  FolderKanban,
  ListChecks,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useSignOut } from "@/utils/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Teamlead Task", href: "/teamlead-task", icon: ListChecks },
  { label: "Employee Task", href: "/employee-task", icon: ClipboardList },
  { label: "Employee", href: "/employee", icon: Users },
];

export function Sidebar({ className = "" }) {
  const pathname = usePathname();
  const signOut = useSignOut();

  return (
    <aside
      className={`fixed h-screen w-16 bg-[#f4f1eb] flex flex-col items-center py-4 ${className}`}
    >
      <nav className="flex-1 w-full flex flex-col items-center space-y-2 p-2">
        <ul className="space-y-4 w-full p-2 bg-white rounded-full">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  className={`group flex items-center justify-center w-12 h-12 rounded-full ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center w-full space-y-4 p-2 bg-white rounded-full">
          <Link
            href="/settings"
            className={`group flex items-center justify-center w-12 h-12 rounded-full ${
              pathname.startsWith("/settings")
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            onClick={signOut}
            className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:bg-gray-200"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </aside>
  );
}
