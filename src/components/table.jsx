"use client";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table
        className={`min-w-full text-sm text-left ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-[#cfc7b5] text-xs font-semibold uppercase text-[#25262b] rounded-xl border-none">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-gray-100 text-[#25262b]">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr
      className={`hover:bg-[#f4f1eb] transition-colors duration-150 ease-in-out ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-6 py-4 font-semibold tracking-wide text-[#25262b] ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-[#25262b] ${className}`}>
      {children}
    </td>
  );
}