"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

export default function DocumentTable({ docs, expandedRow, onToggleRow }) {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Project Name</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>No. of Files</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {docs.flatMap((doc) => [
          <TableRow key={doc.id} className="border-t">
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
            <TableCell>
              {doc.duedate ? new Date(doc.duedate).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              {doc.notes?.length > 40
                ? `${doc.notes.slice(0, 40)}…`
                : doc.notes || "—"}
            </TableCell>
            <TableCell>{doc.files?.length || 0}</TableCell>
          </TableRow>,

          expandedRow === doc.id && (
            <TableRow key={`${doc.id}-expanded`} className="bg-gray-50">
              <TableCell colSpan={5} className="p-0">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doc.files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{doc.projectname}</TableCell>
                          <TableCell>{file.filename}</TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TableCell>
            </TableRow>
          ),
        ])}
      </TableBody>
    </Table>
  );
}
