import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Header({
  openUploadDrawer,
  openAssignDrawer,
  selected,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold">Document Management</h2>

      <div className="flex gap-4">
        <Button
          onClick={openUploadDrawer}
          className="bg-[#fe4f02] hover:bg-[#cc3f01]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Documentsss
        </Button>
        <Button
          disabled={!selected.length}
          onClick={openAssignDrawer}
          className="bg-[#fe4f02] hover:bg-[#cc3f01]"
        >
          Assign to Team Lead ({selected.length})
        </Button>
      </div>
    </div>
  );
}
