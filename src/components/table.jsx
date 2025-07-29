"use client";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border-none bg-[#f4f1eb] ">
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
    <thead className="bg-[#25262b] text-xs font-semibold uppercase text-white rounded-2xl border-none">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-white text-[#25262b]">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr
      className={` transition-colors duration-150 ease-in-out  ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-6 py-4 font-semibold tracking-wide text-white ${className}`}
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