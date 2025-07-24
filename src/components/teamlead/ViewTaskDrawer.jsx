'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Users, FileText, StickyNote } from 'lucide-react'

export default function ViewTaskDrawer({ open, setOpen, task }) {
  if (!task) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[420px] ">
        <SheetHeader>
          <SheetTitle className="text-xl">📄 Task Details</SheetTitle>
          <SheetDescription>
            Detailed overview of the task associated with your assigned document.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm p-5">
          {/* Project Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium">Project Name</label>
            <div className="text-base font-semibold text-primary">
              {task.filename}
            </div>
          </div>

          {/* Due Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Due Date
            </label>
            <div className="text-base">July 25, 2025</div>
          </div>

          {/* Notes */}
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </label>
            <p className="text-sm text-muted-foreground whitespace-pre-line border p-3 rounded-md bg-muted/30">
              {task.note?.trim()
                ? task.note
                : 'No additional notes were provided for this task.'}
            </p>
          </div>

          {/* Assigned Employees */}
          <div className="flex flex-col space-y-2">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assigned Employees
            </label>
            <div className="flex flex-wrap gap-2">
              {task.assignedTo?.length ? (
                task.assignedTo.map((emp) => (
                  <Badge key={emp} variant="outline" className="bg-indigo-100 text-indigo-700">
                    {emp}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground italic">Not yet assigned</p>
              )}
            </div>
          </div>

          {/* Uploaded File */}
          <div className="flex flex-col space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Uploaded File
            </label>
            <a
              href="#"
              className="text-sm underline text-blue-600 hover:text-blue-800 transition-all"
            >
              {task.filename}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
