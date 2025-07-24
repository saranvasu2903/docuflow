"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import VendorSettings from "@/components/settings/VendorSettings";
import AppSettings from "@/components/settings/AppSettings";
import DateTimeSettings from "@/components/settings/DateTimeSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";

const Settings = () => {
  const { role } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(
    role === "admin" ? "Organization" : "app"
  );

  const sidebarItems = [
    ...(role === "admin"
      ? [{ id: "Organization", label: "Organization" }]
      : []),
    { id: "app", label: "App Settings" },
    { id: "datetime", label: "Date & Time" },
    { id: "privacy", label: "Privacy & Security" },
  ];

  return (
    <div className="flex h-screen w-full ">
       <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {activeTab === "Organization" &&
              (role === "admin" ? <VendorSettings /> : <AppSettings />)}
            {activeTab === "app" && <AppSettings />}
            {activeTab === "datetime" && <DateTimeSettings />}
            {activeTab === "privacy" && <PrivacySettings />}
          </div>
        </div>
      </div>
      <aside className="w-[20%] p-6 flex flex-col shadow-xl">
        <h2 className="text-white text-2xl font-bold mb-8 pl-3">Settings</h2>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                transition-all duration-300
                ${
                  activeTab === item.id
                    ? "bg-white/20 text-white backdrop-blur-md shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="flex items-center">
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="text-white/60 text-xs px-4">
            v2.4.0 • Settings Panel
          </div>
        </div>
      </aside>

     
    </div>
  );
};

export default Settings;