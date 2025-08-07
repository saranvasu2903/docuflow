"use client";

import React from "react";

const PrivacySettings = () => {
  return (
    <div className="bg-white p-2  ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Privacy Settings</h2>
      
      <div className="space-y-6">
        {/* Cookie Settings */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Cookie Settings
            </label>
            <select className="p-2.5 text-sm focus:ring-2 focus:ring-[#0F0E47] focus:border-[#0F0E47]">
              <option>Customize</option>
              <option>Accept All</option>
              <option>Reject Non-Essential</option>
              <option>Reject All</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Manage your cookie preferences for this application
          </p>
        </div>

        {/* View History Toggle */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Show View History
            </h3>
            <p className="text-sm text-gray-500">
              Control whether your browsing history is visible in your profile
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0E47]"></div>
          </label>
        </div>

        {/* Data Collection */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Allow Analytics Data Collection
            </h3>
            <p className="text-sm text-gray-500">
              Help us improve by sharing anonymous usage data
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0E47]"></div>
          </label>
        </div>

        {/* Data Retention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Retention Period
          </label>
          <select className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#0F0E47] focus:border-[#0F0E47]">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
            <option>Indefinitely</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            How long we keep your personal data before automatic deletion
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;