'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'

export default function UploadWorkDrawer({ open, setOpen, task, onComplete }) {
  const [file, setFile] = useState(null)
  const [note, setNote] = useState('')

  if (!task) return null

  const handleSubmit = () => {
    // In a real app you'd upload the file. Here we just simulate success:
    onComplete(task.id, file?.name || 'Finished_File.pdf')
    setFile(null)
    setNote('')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Upload Completed Work</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {task.projectName}
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          {/* Upload field */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Select File</label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Optional Note</label>
            <Textarea
              placeholder="Write a note for your team lead..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button
            className="w-full"
            disabled={!file}
            onClick={handleSubmit}
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Submit Work
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
