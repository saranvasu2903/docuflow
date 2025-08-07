"use client";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border-none table-bg">
      <table className={`min-w-full text-sm text-left ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="table-header text-xs font-semibold uppercase rounded-2xl border-none">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="table-row-divider table-cell-text">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`transition-colors duration-150 ease-in-out ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-6 py-4 font-semibold tracking-wide table-head-text ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 table-cell-text ${className}`}>
      {children}
    </td>
  );
}
