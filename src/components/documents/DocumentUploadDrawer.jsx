import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, X, FileText, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUploadDocument } from "@/hooks/documents";

export default function DocumentUploadDrawer({ open, onOpenChange, onUpload }) {
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);

  const { uploadDocument, isUploading } = useUploadDocument();

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    console.log("FormData:", formData);

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
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
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
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
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

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!projectName || files.length === 0 || isUploading}
          className="w-full bg-[#fe4f02] hover:bg-[#cc3f01]"
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