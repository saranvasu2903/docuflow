export function HeaderSection() {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-b-3xl flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Good morning, Alex!</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-800 px-3 py-1.5 rounded-md flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-sm">January 8, 2024</span>
        </div>
      </div>
    </div>
  );
}
