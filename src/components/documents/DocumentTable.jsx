"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner"; // Adjust the import path as needed
import React from "react";

export default function DocumentTable({ docs, expandedRow, onToggleRow }) {
  if (!docs || docs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white ">
        <table className="min-w-full text-sm text-left">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Project Name</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>No. of Files</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {docs.map((doc) => (
              <React.Fragment key={doc.id}>
                <TableRow>
                  <TableCell className="w-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleRow(doc.id)}
                    >
                      {expandedRow === doc.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{doc.projectname}</TableCell>
                  <TableCell>{doc.uploadedUser?.fullname || "--"}</TableCell>
                  <TableCell>
                    {doc.duedate
                      ? new Date(doc.duedate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {doc.notes?.length > 40
                      ? `${doc.notes.slice(0, 40)}…`
                      : doc.notes || "—"}
                  </TableCell>
                  <TableCell>{doc.files?.length || 0}</TableCell>
                </TableRow>

                {expandedRow === doc.id && (
                  <tr>
                    <td colSpan={6} className="!p-0 !m-0 bg-white">
                      <div className="w-full overflow-x-auto border-t border-gray-200">
                        <table className="min-w-full text-sm text-left">
                          <thead className="bg-[#f1f1f1] text-xs font-semibold uppercase text-[#25262b]">
                            <tr>
                              <th className="px-6 py-3">Project Name</th>
                              <th className="px-6 py-3">Filename</th>
                              <th className="px-6 py-3">Download</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[#25262b]">
                            {doc.files?.length > 0 ? (
                              doc.files.map((file) => (
                                <tr key={file.id}>
                                  <td className="px-6 py-4">
                                    {doc.projectname}
                                  </td>
                                  <td className="px-6 py-4">
                                    {file.filename}
                                  </td>
                                  <td className="px-6 py-4">
                                    <a
                                      href={file.filepath}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4 text-blue-600" />
                                      </Button>
                                    </a>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="px-6 py-4 text-center"
                                >
                                  No files available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
