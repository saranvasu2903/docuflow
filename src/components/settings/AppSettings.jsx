"use client";

import React, { useEffect, useState } from "react";

const COLORS = [
  { name: "Royal Purple", code: "#6D28D9" },
  { name: "Sapphire Blue", code: "#1E40AF" },
  { name: "Emerald Green", code: "#059669" },
  { name: "Amber Gold", code: "#D97706" },
  { name: "Crimson Red", code: "#B91C1C" },
  { name: "Charcoal Black", code: "#1F2937" },
];

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) - percent;
  let g = ((num >> 8) & 0x00ff) - percent;
  let b = (num & 0x0000ff) - percent;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function applyThemeColor(color) {
  const hoverColor = darkenColor(color, 15);
  const light2 = lightenColor(color, 60);
  const light1 = lightenColor(color, 30);
  const dark1 = darkenColor(color, 10);
  document.documentElement.style.setProperty("--btn-primary-bg", color);
  document.documentElement.style.setProperty("--btn-primary-hover-bg", hoverColor);
  document.documentElement.style.setProperty("--table-bg-1", light2);
  document.documentElement.style.setProperty("--table-bg-2", light1);
  document.documentElement.style.setProperty("--table-bg-3", color);
  document.documentElement.style.setProperty("--table-bg-4", dark1);
}

const AppSettings = () => {
  const [currentThemeColor, setCurrentThemeColor] = useState("");

  useEffect(() => {
    const storedColor = localStorage.getItem("themeColor");
    const initialColor = storedColor || COLORS[0].code;
    setCurrentThemeColor(initialColor);
    applyThemeColor(initialColor);
  }, []);

  const handleColorClick = (color) => {
    setCurrentThemeColor(color);
    localStorage.setItem("themeColor", color);
    applyThemeColor(color);
  };

  return (
    <div className="w-full p-2 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Theme Customization</h2>
        <p className="text-gray-500">
          Choose a primary theme color for your application.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Color</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {COLORS.map((color) => (
            <div
              key={color.code}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleColorClick(color.code)}
            >
              <div
                className={`h-14 w-14 rounded-full border-2 transition-all duration-200 ${
                  currentThemeColor === color.code
                    ? "ring-2 ring-offset-2 ring-gray-800 border-white"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color.code }}
              />
              <span className="text-xs font-medium text-gray-700">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-gray-50 border">
        <h4 className="font-medium mb-2">Tip</h4>
        <p className="text-sm text-gray-600">
          The selected color will be applied instantly and used across buttons, highlights, and more.
        </p>
      </div>
    </div>
  );
};

export default AppSettings;
