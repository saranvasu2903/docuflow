"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, ChevronUp, Download, Plus } from "lucide-react";
import { DocumentUploadDrawer } from "../components/Documets/DocumentUploadDrawer";
import { useGetUploadedDocument } from "@/hooks/documents";

/* -------------------------------------------------------------------------- */
/*                                SUB–COMPONENTS                              */
/* -------------------------------------------------------------------------- */
function DocumentTable({ docs, expandedRow, onToggleRow }) {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead /> {/* caret */}
          <TableHead>Project Name</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>No. of Files</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {docs.flatMap((doc) => [
          // Parent row
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
          </TableRow>,
          // Expanded row (conditionally included)
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

function AssignDrawer({
  open,
  onOpenChange,
  selected,
  teamLeads,
  chosenLead,
  setChosenLead,
  assignLead,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            Assign Documents
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6 p-5">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              You’re assigning <strong>{selected.length}</strong> document
              {selected.length !== 1 ? "s" : ""} to a team lead.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Select Team Lead
            </h3>
            <RadioGroup
              value={chosenLead}
              onValueChange={setChosenLead}
              className="space-y-3"
            >
              {teamLeads.map((tl) => (
                <div
                  key={tl.id}
                  className="flex items-center gap-3 border rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <RadioGroupItem
                    value={tl.id}
                    id={tl.id}
                    className="h-5 w-5 text-purple-600"
                  />
                  <label
                    htmlFor={tl.id}
                    className="w-full cursor-pointer text-gray-700 font-medium"
                  >
                    {tl.name}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            disabled={!selected.length}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={assignLead}
          >
            Confirm Assignment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Header({ openUploadDrawer, openAssignDrawer, selected }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold">Document Management</h2>

      <div className="flex gap-4">
        <Button
          onClick={openUploadDrawer}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>

        <Button
          disabled={!selected.length}
          onClick={openAssignDrawer}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        >
          Assign to Team Lead ({selected.length})
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function DocumentsPage() {
  const { documents, isLoading } = useGetUploadedDocument();

  /* selection logic if you later add checkboxes */
  const [selected, setSelected] = useState([]);

  /* drawers & dropdown */
  const [uploadDrawer, setUploadDrawer] = useState(false);
  const [assignDrawer, setAssignDrawer] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  /* team lead picker */
  const [chosenLead, setChosenLead] = useState("tl1");
  const teamLeads = [
    { id: "tl1", name: "Alice TL" },
    { id: "tl2", name: "Bob TL" },
  ];

  /*  handlers  */
  const toggleRow = (id) => setExpandedRow((prev) => (prev === id ? null : id));

  const assignLead = () => {
    /* your assign logic here */
    setSelected([]);
    setAssignDrawer(false);
  };

  const handleUpload = () => {
    /* you might refetch documents after upload */
    setUploadDrawer(false);
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        openUploadDrawer={() => setUploadDrawer(true)}
        openAssignDrawer={() => setAssignDrawer(true)}
        selected={selected}
      />

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-6 text-center">Loading…</p>
          ) : (
            <DocumentTable
              docs={documents}
              expandedRow={expandedRow}
              onToggleRow={toggleRow}
            />
          )}
        </div>
      </div>

      {/* Upload Drawer */}
      <Sheet open={uploadDrawer} onOpenChange={setUploadDrawer}>
        <SheetContent side="right" className="w-full sm:w-[480px]">
          <DocumentUploadDrawer
            open={uploadDrawer}
            onOpenChange={setUploadDrawer}
            onUpload={handleUpload}
          />
        </SheetContent>
      </Sheet>

      {/* Assign Drawer */}
      <AssignDrawer
        open={assignDrawer}
        onOpenChange={setAssignDrawer}
        selected={selected}
        teamLeads={teamLeads}
        chosenLead={chosenLead}
        setChosenLead={setChosenLead}
        assignLead={assignLead}
      />
    </div>
  );
}
