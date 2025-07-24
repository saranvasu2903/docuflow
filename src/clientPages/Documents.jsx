"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useGetUploadedDocument } from "@/hooks/documents";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  UploadCloud,
  X,
  FileText,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUploadDocument } from "@/hooks/documents";
import DocumentTable from "@/components/Documents/DocumentTable";
import AssignDrawer from "@/components/Documents/AssignDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProjectsByOrg } from "@/hooks/projects";
import { useSelector } from "react-redux";

function Header({ openUploadDrawer, openAssignDrawer, selected }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold">Document Management</h2>
      <div className="flex gap-4">
        <Button
          onClick={openUploadDrawer}
          className="bg-[#fe4f02] hover:bg-[#cc3f01] cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
        <Button
          disabled={!selected.length}
          onClick={openAssignDrawer}
          className="bg-[#fe4f02] hover:bg-[#cc3f01] cursor-pointer"
        >
          Assign to Team Lead ({selected.length})
        </Button>
      </div>
    </div>
  );
}

function DocumentUploadDrawer({ open, onOpenChange, onUpload, projects }) {
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);
  const { uploadDocument, isUploading } = useUploadDocument();
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" exceeds the 10 MB limit and will not be uploaded.`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!projectName || files.length === 0) {
      alert("Please fill in the project name and upload at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("notes", notes);
    if (dueDate) formData.append("dueDate", dueDate.toISOString());
    files.forEach((file) => formData.append("files", file));

    try {
      await uploadDocument(formData, {
        onSuccess: () => {
          onUpload();
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload documents. Please try again.");
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setProjectName("");
    setNotes("");
    setDueDate(null);
    setFiles([]);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-800">Upload New Documents</h2>

      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <Select value={projectName} onValueChange={setProjectName}>
          <SelectTrigger id="projectName">
            <SelectValue placeholder="Select project name" />
          </SelectTrigger>
          <SelectContent className="z-50"> {/* Increased z-index */}
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-auto p-0"> {/* Increased z-index */}
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>

      {/* File Upload */}
      <div>
        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Files *
        </label>
        <label
          htmlFor="fileUpload"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX (Max 10MB each)</p>
          </div>
          <input
            id="fileUpload"
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileChange}
          />
        </label>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileIcon extension={file.name.split(".").pop()} />
                  <span className="text-sm text-gray-700 truncate max-w-[180px]">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!projectName || files.length === 0 || isUploading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md"
        >
          {isUploading ? "Uploading…" : "Upload Documents"}
        </Button>
      </div>
    </div>
  );
}

function FileIcon({ extension }) {
  const iconProps = { className: "w-4 h-4" };

  switch (extension?.toLowerCase()) {
    case "pdf":
      return <FileText {...iconProps} className="text-red-500" />;
    case "docx":
      return <FileText {...iconProps} className="text-blue-500" />;
    case "xlsx":
      return <FileSpreadsheet {...iconProps} className="text-green-500" />;
    default:
      return <FileText {...iconProps} className="text-gray-500" />;
  }
}

export default function DocumentsPage() {
  const { documents, isLoading } = useGetUploadedDocument();
  const [selected, setSelected] = useState([]);
  const [uploadDrawer, setUploadDrawer] = useState(false);
  const [assignDrawer, setAssignDrawer] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [chosenLead, setChosenLead] = useState("tl1");
  const teamLeads = [
    { id: "tl1", name: "Alice TL" },
    { id: "tl2", name: "Bob TL" },
  ];

  const { role, organizationId } = useSelector((state) => ({
    role: state.user.role,
    organizationId: state.user.organizationId,
  }));

  const {
    projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsByOrg(organizationId, {
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const toggleRow = (id) => setExpandedRow((prev) => (prev === id ? null : id));

  const assignLead = () => {
    setSelected([]);
    setAssignDrawer(false);
  };

  const handleUpload = () => {
    setUploadDrawer(false);
  };

  if (projectsError) {
    return <div className="p-6 text-red-500">Error loading projects. Please try again later.</div>;
  }

  return (
    <div className="p-4">
      <Header
        openUploadDrawer={() => setUploadDrawer(true)}
        openAssignDrawer={() => setAssignDrawer(true)}
        selected={selected}
      />

      <div >
        <div className="overflow-x-auto">
          {isLoading || projectsLoading ? (
            <p className="p-6 text-center">Loading...</p>
          ) : (
            <DocumentTable
              docs={documents || []}
              expandedRow={expandedRow}
              onToggleRow={toggleRow}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      <Sheet open={uploadDrawer} onOpenChange={setUploadDrawer}>
        <SheetContent side="right" className="custom-drawer-content">
          <DocumentUploadDrawer
            open={uploadDrawer}
            onOpenChange={setUploadDrawer}
            onUpload={handleUpload}
            projects={projects || []}
          />
        </SheetContent>
      </Sheet>

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