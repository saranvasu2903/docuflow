"use client";

import React from "react";

const DateTimeSettings = () => {
  return (
    <div className="bg-white p-2 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Date & Time Settings</h2>
      
      <div className="space-y-6">
        {/* Timezone Auto-Detection */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Automatic Timezone Detection
            </h3>
            <p className="text-sm text-gray-500">
              Reminders, notifications and emails are delivered based on your time zone
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0E47]"></div>
          </label>
        </div>

        {/* Timezone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Timezone
          </label>
          <select className="w-full p-2.5   focus:ring-2 focus:ring-[#0F0E47] focus:border-[#0F0E47]">
            <option>USA/Arizona (MST)</option>
            <option>UTC (Coordinated Universal Time)</option>
            <option>Europe/London (GMT)</option>
            <option>Asia/Kolkata (IST)</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select className="w-full p-2.5  rounded-md focus:ring-2 focus:ring-[#0F0E47] focus:border-[#0F0E47]">
            <option>MM/DD/YYYY (12/31/2023)</option>
            <option>DD/MM/YYYY (31/12/2023)</option>
            <option>YYYY-MM-DD (2023-12-31)</option>
          </select>
        </div>

        {/* Time Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Format
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" name="time-format" className="h-4 w-4 text-[#0F0E47] focus:ring-[#0F0E47]" defaultChecked />
              <span className="ml-2 text-gray-700">12-hour (3:45 PM)</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="time-format" className="h-4 w-4 text-[#0F0E47] focus:ring-[#0F0E47]" />
              <span className="ml-2 text-gray-700">24-hour (15:45)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSettings;