"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import { Upload, File, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ batchName, onUploadComplete }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const fileList = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      size:
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`,
      status: "pending",
      type: file.type.split("/")[0],
    }));
    setFiles((prev) => [...prev, ...fileList]);
    setDragOver(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!batchName || files.length === 0) {
      alert("Please provide batch name and files.");
      return;
    }

    setUploading(true);
    setFiles((prev) => prev.map((f) => ({ ...f, status: "uploading" })));

    const formData = new FormData();
    files.forEach(({ file, name }) => formData.append("file", file, name));
    formData.append("batchName", batchName);

    try {
      const res = await axios.post("/api/orders-creation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFiles((prev) => prev.map((f) => ({ ...f, status: "uploaded" })));
      setResponse(res.data);
      onUploadComplete && onUploadComplete(res.data);
    } catch (error) {
      console.error(error);
      setResponse({ success: false, error: error.message });
      setFiles((prev) => prev.map((f) => ({ ...f, status: "error" })));
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setFiles([]);
    setResponse(null);
  };

  const colors = {
    background: "bg-[#f8f9fa]",
    dropzoneBorder: "border-[#e0e0e0]",
    dropzoneActive: "border-[#4d90fe] bg-[#e8f0fe]",
    textPrimary: "text-[#202124]",
    textSecondary: "text-[#5f6368]",
    fileCard: "bg-white",
    buttonPrimary: "bg-[#1a73e8] hover:bg-[#1765cc]",
    buttonSecondary: "bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]",
    success: "text-[#188038]",
    uploading: "text-[#f9ab00]",
    error: "text-[#d93025]",
  };

  return (
    <div className="w-full">
      <div className={`p-6 ${colors.background} rounded-3xl w-full`}>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-colors w-full ${
            dragOver ? colors.dropzoneActive : colors.dropzoneBorder
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`w-10 h-10 mx-auto ${colors.textSecondary} mb-3`}
          />
          <h3 className={`text-lg font-medium ${colors.textPrimary} mb-1`}>
            Upload your order documents
          </h3>
          <p className={`${colors.textSecondary} mb-2`}>
            Drop your files here or select a file from your computer.
          </p>
          <p className={`text-sm ${colors.textSecondary}`}>
            PDF, JPG, PNG, GIF up to 10MB
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-3 w-full">
            {files.map(({ name, size, status, type }, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 ${colors.fileCard} rounded-lg border border-[#dadce0] w-full`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <File
                    className={`w-5 h-5 ${
                      type === "image" ? "text-[#34a853]" : "text-[#1a73e8]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${colors.textPrimary} truncate`}
                    >
                      {name}
                    </p>
                    <p className={`text-xs ${colors.textSecondary}`}>{size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {status === "uploading" && (
                    <span className={`text-xs ${colors.uploading}`}>
                      Uploading...
                    </span>
                  )}
                  {status === "uploaded" && (
                    <span className={`text-xs ${colors.success}`}>
                      Uploaded
                    </span>
                  )}
                  {status === "error" && (
                    <span className={`text-xs ${colors.error}`}>Error</span>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className={`p-1 rounded-full hover:bg-[#f1f3f4] transition-colors`}
                  >
                    <X className="w-5 h-5 text-[#5f6368]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6 flex justify-end space-x-3 w-full">
            <button
              onClick={cancelUpload}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${colors.buttonSecondary}`}
            >
              Cancel
            </button>
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                uploading
                  ? "bg-[#1a73e8]/70 cursor-not-allowed"
                  : colors.buttonPrimary
              }`}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        )}

        {response && (
          <div className="mt-4 w-full">
            {response.success ? (
              <div className={`p-3 rounded-lg ${colors.success} bg-[#e6f4ea]`}>
                <p>✅ Upload complete!</p>
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${colors.error} bg-[#fce8e6]`}>
                <p>{response.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
