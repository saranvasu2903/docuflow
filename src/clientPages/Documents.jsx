"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useGetUploadedDocument } from "@/hooks/documents";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProjectsByOrg } from "@/hooks/projects";
import { useSelector } from "react-redux";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetRoles } from "@/hooks/role";

function Header({ openUploadDrawer }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold">Document Management</h2>
      <div className="flex gap-4">
        <Button
          onClick={openUploadDrawer}
          className="border border-[#fe4f02] text-[#fe4f02] cursor-pointer bg-white rounded-full flex items-center transition-colors duration-200 hover:bg-[#fe4f02] hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
      </div>
    </div>
  );
}

function DocumentUploadDrawer({ open, onOpenChange, onUpload, projects }) {
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [teamLead, setTeamLead] = useState([]); // New state for team lead
  const { uploadDocument, isUploading } = useUploadDocument();
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const uploadedby = useSelector((state) => state.user.userId);
  const { data: roles } = useGetRoles();
  const teamLeadRoleId = useMemo(() => {
    if (!roles?.data) return null;
    const role = roles.data.find(
      (r) => r.roleName.toLowerCase() === "team lead"
    );
    return role?.id;
  }, [roles]);

  const selectedProject = projects.find((p) => p.id === projectId);

  const teamLeads = useMemo(() => {
    if (!selectedProject || !teamLeadRoleId) return [];
    return selectedProject.project_members.filter(
      (member) => Number(member.users.role) === teamLeadRoleId
    );
  }, [selectedProject, teamLeadRoleId]);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `File "${file.name}" exceeds the 10 MB limit and will not be uploaded.`
        );
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
    formData.append("uploadedby", uploadedby);
    formData.append("notes", notes);
    if (dueDate) formData.append("dueDate", dueDate.toISOString());

    // Append teamLead array
    teamLead.forEach((id) => formData.append("teamlead", id));

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
    setTeamLead("");
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Upload New Documents
        </h2>

        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Project Name *
          </label>
          <Select
            value={projectId}
            onValueChange={(id) => {
              const selected = projects.find((p) => p.id === id);
              setProjectId(id);
              setProjectName(selected?.name || "");
            }}
          >
            <SelectTrigger id="projectName">
              <SelectValue placeholder="Select project name" />
            </SelectTrigger>
            <SelectContent className="z-[9999] !absolute !top-full !left-0">
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assign to Team Lead */}
        <div>
          <label
            htmlFor="teamLead"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Assign to Team Leads
          </label>
          {teamLeads.length === 0 ? (
            <p className="text-sm text-gray-500">No team leads available</p>
          ) : (
            <div className="space-y-2 border p-3 rounded-md">
              {teamLeads.map((member) => (
                <div key={member.user_id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`teamLead-${member.user_id}`}
                    value={member.user_id}
                    checked={teamLead.includes(member.user_id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTeamLead((prev) => [...prev, member.user_id]);
                      } else {
                        setTeamLead((prev) =>
                          prev.filter((id) => id !== member.user_id)
                        );
                      }
                    }}
                    className="form-checkbox"
                  />
                  <label
                    htmlFor={`teamLead-${member.user_id}`}
                    className="text-sm"
                  >
                    {member.users.fullname || member.users.email}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[9999] w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
          <label
            htmlFor="fileUpload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload Files *
          </label>
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-purple-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOCX, XLSX (Max 10MB each)
              </p>
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
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon extension={file.name.split(".").pop()} />
                    <span className="text-sm text-gray-700 truncate max-w-[180px]">
                      {file.name}
                    </span>
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

        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!projectName || files.length === 0 || isUploading}
            className={`w-full border border-[#fe4f02] text-[#fe4f02] bg-white rounded-full flex items-center justify-center transition-colors duration-200
        hover:bg-[#fe4f02] hover:text-white 
        disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUploading ? "Uploading…" : "Upload Documents"}
          </Button>
        </div>
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
  const [expandedRow, setExpandedRow] = useState(null);
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

  const handleUpload = () => {
    setUploadDrawer(false);
  };

  if (projectsError) {
    return (
      <div className="p-6 text-red-500">
        Error loading projects. Please try again later.
      </div>
    );
  }

  if (isLoading || projectsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <Header openUploadDrawer={() => setUploadDrawer(true)} />

      <div>
        <div className="overflow-x-auto">
          <DocumentTable
            docs={documents || []}
            expandedRow={expandedRow}
            onToggleRow={toggleRow}
            selected={selected}
            onSelect={setSelected}
          />
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
    </div>
  );
}
