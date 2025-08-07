"use client";

import React, { useState } from "react";
import VendorSettings from "@/components/settings/VendorSettings";
import AppSettings from "@/components/settings/AppSettings";
import DateTimeSettings from "@/components/settings/DateTimeSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import RolesManagement from "@/components/settings/RolesManagement";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Organization");

  const sidebarItems = [
    { id: "Organization", label: "Organization" },
    { id: "role and permission", label: "Roles & Permission" },
    { id: "app", label: "App Settings" },
    { id: "datetime", label: "Date & Time" },
    { id: "privacy", label: "Privacy & Security" },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <aside className="w-[240px] m-2 rounded-3xl div-body text-white p-3 flex-shrink-0 flex flex-col">
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-3xl cursor-pointer ${
                activeTab === item.id ? "selected-div-body" : "text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-4 text-xs text-white">v2.4.0 • Settings Panel</div>
      </aside>

      <main className="flex-1 overflow-y-auto p-2 bg-white">
        {activeTab === "Organization" && <VendorSettings />}
        {activeTab === "app" && <AppSettings />}
        {activeTab === "datetime" && <DateTimeSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "role and permission" && <RolesManagement />}
      </main>
    </div>
  );
};

export default Settings;
