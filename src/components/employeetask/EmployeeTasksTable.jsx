'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Upload } from 'lucide-react'

export default function EmployeeTasksTable({ tasks, onUploadClick, onStatusChange }) {
  const statusOptions = ['Pending', 'In Progress', 'Completed']

  return (
    <div className="rounded-xl  bg-white  overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="px-4 py-3">Project</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Due</TableHead>
            <TableHead className="px-4 py-3">Files</TableHead>
            <TableHead className="px-4 py-3 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="border-b hover:bg-muted/40">
              <TableCell className="px-4 py-3 font-medium">{task.projectName}</TableCell>

              {/* status dropdown */}
              <TableCell className="px-4 py-3">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="text-sm border rounded-md px-2 py-1 bg-transparent"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell className="px-4 py-3 text-sm">
                {task.dueDate}
              </TableCell>

              {/* File links */}
              <TableCell className="px-4 py-3">
                <div className="flex gap-2 items-center">
                  <a href={task.attachment} className="underline flex items-center gap-1">
                    <Download className="w-4 h-4" /> Source
                  </a>
                  {task.submittedFile && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Sent
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="px-4 py-3 text-right">
                <Button size="sm" onClick={() => onUploadClick(task)}>
                  <Upload className="w-4 h-4 mr-1" />
                  Upload Work
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
