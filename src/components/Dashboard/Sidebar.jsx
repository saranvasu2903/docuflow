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
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const navItems = [
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    module: "projects",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    module: "documents",
  },
  {
    label: "Teamlead Task",
    href: "/teamlead-task",
    icon: ListChecks,
    module: "teamlead-task",
  },
  // {
  //   label: "Employee Task",
  //   href: "/employee-task",
  //   icon: ClipboardList,
  //   module: "employee-task",
  // },
  { label: "Employee", href: "/employee", icon: Users, module: "employee" },
];

export function Sidebar({ className = "" }) {
  const permission = useSelector((state) => state.user.permission);

  const pathname = usePathname();
  const signOut = useSignOut();

  useEffect(() => {
    // console.log("User Permissions from Redux:", permission);
  }, [permission]);

  const visibleNavItems = useMemo(() => {
    if (!Array.isArray(permission)) return [];

    return navItems.filter((item) => {
      const found = permission.find((perm) => perm.module === item.module);
      return found?.actions.includes("view");
    });
  }, [permission]);

  const hasViewPermission = (moduleName) => {
    const found = permission.find((perm) => perm.module === moduleName);
    return found?.actions.includes("view");
  };

  return (
    <aside
      className={`fixed h-screen w-16 bg-[#f4f1eb] flex flex-col items-center ${className}`}
    >
      <nav className="flex-1 w-full flex flex-col items-center space-y-2 p-2">
        <div className="flex flex-col items-center w-full space-y-4 p-2 bg-white rounded-full">
          <Link
            href="/dashboard"
            className={`group flex items-center justify-center w-12 h-12 rounded-full ${
              pathname.startsWith("/dashboard")
                ? "bg-nav-active"
                : "text-black bg-nav-hover"
            }`}
            title="Dashboard"
          >
            <Home className="h-5 w-5" />
          </Link>
        </div>

        <ul className="space-y-3 w-full p-2 bg-white rounded-full">
          {visibleNavItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  className={`group flex items-center justify-center w-12 h-12 rounded-full ${
                    isActive ? "bg-nav-active" : "text-black bg-nav-hover"
                  }`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center w-full space-y-3 p-2 bg-white rounded-full">
          {hasViewPermission("settings") && (
            <Link
              href="/settings"
              className={`group flex items-center justify-center w-12 h-12 rounded-full ${
                pathname.startsWith("/settings")
                  ? "bg-nav-active"
                  : "text-black bg-nav-hover"
              }`}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          )}

          <button
            onClick={signOut}
            className="flex items-center justify-center w-12 h-12 rounded-full text-black bg-nav-hover cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </aside>
  );
}
