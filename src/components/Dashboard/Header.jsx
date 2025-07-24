"use client";

import { Bell } from "lucide-react";

export function Header({ className }) {
  return (
    <header
      className={`bg-white border-b border-gray-100 h-16 flex items-center px-6 ${className}`}
    >
      <nav className="flex-1" />
      <div className="flex items-center gap-5">
        {[{ icon: Bell, notification: true }].map(
          ({ icon: Icon, notification }, idx) => (
            <button
              key={idx}
              className="p-2 relative text-gray-400 hover:text-gray-800 transition-colors"
            >
              <Icon className="h-5 w-5" />
              {notification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          )
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm text-black">✓</span>
            </div>
            <div className="text-sm font-medium text-black">
              <p>Docuflow Brand</p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#fe4f02] flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">D</span>
          </div>
        </div>
      </div>
    </header>
  );
}
