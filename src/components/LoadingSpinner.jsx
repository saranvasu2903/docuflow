"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/20">
      <div className="flex items-end space-x-1 h-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 rounded bg-orange-loader animate-wave-bar"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "1.2s",
              height: "100%",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
