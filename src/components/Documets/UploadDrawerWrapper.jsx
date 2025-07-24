"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DocumentUploadDrawer } from "./DocumentUploadDrawer";

export default function UploadDrawerWrapper({ open, onOpenChange, onUpload }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px]">
        <DocumentUploadDrawer
          open={open}
          onOpenChange={onOpenChange}
          onUpload={onUpload}
        />
      </SheetContent>
    </Sheet>
  );
}
