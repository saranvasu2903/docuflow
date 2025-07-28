"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  LogOut,
  Users,
  FileText,
  FolderKanban,
  ListChecks,
  ClipboardList,
} from "lucide-react";
import { useSignOut } from "@/utils/auth";
import { useSelector } from "react-redux";

const NAV = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Task list", href: "/teamlead-task", icon: ListChecks },
  // { label: "Work Items", href: "/employee-task", icon: ClipboardList },
  { label: "Employees", href: "/employee", icon: Users },
];

export function Sidebar({ className = "" }) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const { email, fullName, imageUrl } = useSelector((state) => state.user);

  return (
    <aside
      className={`w-20 bg-white text-gray-800 flex flex-col border-r border-gray-200 items-center py-4 h-screen fixed ${className}`}
    >
      <nav className="flex-1 w-full overflow-y-auto scrollbar-hide">
        <ul className="space-y-6 w-full px-2">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  className={`
                    group flex items-center justify-center p-3 rounded-full
                    ${
                      active
                        ? "bg-[#fe4f02] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col items-center w-full px-2 space-y-6 pb-4">
        <Link
          href="/settings"
          className={`
            group flex items-center justify-center p-3 rounded-full
            ${
              pathname.startsWith("/settings")
                ? "bg-[#fe4f02] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <button
          onClick={signOut}
          className="flex items-center justify-center p-3 rounded-full text-gray-600 hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
}
