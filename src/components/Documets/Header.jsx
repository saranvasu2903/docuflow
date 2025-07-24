"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Header({ openUploadDrawer, openAssignDrawer, selected }) {
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
