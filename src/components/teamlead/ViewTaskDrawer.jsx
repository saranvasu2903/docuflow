"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, FileText, StickyNote, User } from "lucide-react";

export default function ViewTaskDrawer({ open, setOpen, task }) {
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full custom-drawer-content">
        <SheetHeader>
          <SheetTitle className="text-xl">📄 Task Details</SheetTitle>
          <SheetDescription>
            Detailed overview of the task associated with your assigned
            document.
          </SheetDescription>
        </SheetHeader>

        <div className=" space-y-6 text-sm p-5 overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium">
              Project Name
            </label>
            <div className="text-base font-semibold text-primary">
              {task.projectname || "—"}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Due Date
            </label>
            <div className="text-base">
              {task.duedate ? new Date(task.duedate).toLocaleDateString() : "—"}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Uploaded By
            </label>
            <div className="text-base">
              {task.uploadedUser?.fullname || "—"}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Files Count
            </label>
            <div className="text-base">{task.files?.length || 0}</div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </label>
            <p className="text-sm text-muted-foreground whitespace-pre-line border p-3 rounded-md bg-muted/30">
              {task.notes?.trim()
                ? task.notes
                : "No additional notes were provided for this task."}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assigned Employees
            </label>
            <div className="flex flex-wrap gap-2">
              {task.teamlead?.split(",").length > 0 ? (
                task.teamlead.split(",").map((emp, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-indigo-100 text-indigo-700"
                  >
                    {emp.trim() || "Unknown"}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground italic">Not yet assigned</p>
              )}
            </div>
          </div>
              
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Uploaded File(s)
            </label>
            {task.files?.length > 0 ? (
              task.files.map((file, index) => (
                <a
                  key={index}
                  href={file.filepath || "#"}
                  className="text-sm underline text-blue-600 hover:text-blue-800 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.filename || "Unnamed File"}
                </a>
              ))
            ) : (
              <p className="text-muted-foreground italic">No files uploaded</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
