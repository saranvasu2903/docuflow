"use client";

import React from "react";
import { Input } from "@/components/ui/input";

const AppSettings = () => {
  return (
    <div className="bg-white p-8 rounded-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">App Preferences</h2>
        <p className="text-gray-500">
          Customize your workspace experience and visual appearance
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Default View Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Startup Behavior
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default View
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                <option>All Products</option>
                <option>Recent Items</option>
                <option>Favorites</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-lg w-full">
                <input 
                  type="checkbox" 
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300" 
                />
                <span className="text-sm text-gray-700">Show recent items on dashboard</span>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Appearance
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Preference
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                <option>System Default</option>
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex space-x-3">
                {['purple', 'blue', 'green', 'orange'].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full bg-${color}-500 ring-offset-2 focus:ring-2 focus:ring-${color}-500`}
                    aria-label={`Select ${color} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Section */}
        <div className="pt-4 border-t border-gray-100">
          <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            Show advanced settings...
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;