"use client";

export default function LoadingSpinner() {
   return (
    <main className="p-6 animate-pulse space-y-6">
      <div className="h-10 w-2/3 rounded-lg bg-base-200" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-full rounded-md bg-base-200" />
        ))}
      </div>
    </main>
  );
}