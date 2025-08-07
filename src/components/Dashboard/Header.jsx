"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MailCheck } from "lucide-react";

const navItems = [
  { label: "Notification", href: "/events", icon: Bell },
  { label: "Message", href: "/message", icon: MailCheck },
];

export function Header({ className }) {
  const pathname = usePathname();

  return (
    <header
      className={`bg-[#f4f1eb] h-16 w-full flex justify-between items-center ${className}`}
    >
      <nav className="flex w-full justify-end items-center py-2">
        <ul className="flex space-x-3 p-2 bg-white rounded-full my-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                    isActive ? "bg-nav-active" : "text-black bg-nav-hover"
                  }`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </li>
            );
          })}

          <li>
            <Link
              href="/dashboard"
              className="group flex items-center justify-center w-12 h-12 bg-nav-active rounded-full font-semibold text-lg transition-colors"
              title="Dashboard"
            >
              D
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
