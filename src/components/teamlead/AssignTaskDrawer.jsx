'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

const dummyEmployees = [
  { id: 'emp1', name: 'Employee A' },
  { id: 'emp2', name: 'Employee B' },
  { id: 'emp3', name: 'Employee C' },
]

export default function AssignTaskDrawer({ open, setOpen, document }) {
  const [taskDetail, setTaskDetail] = useState('')
  const [note, setNote] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState([])

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    )
  }

  const handleSubmit = () => {
    alert(`Task for "${document?.filename}" assigned to: ${selectedEmployees.join(', ')}`)
    setTaskDetail('')
    setNote('')
    setSelectedEmployees([])
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Assign Task</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Document: <strong>{document?.filename}</strong>
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-4 p-4">
          <div>
            <label className="text-sm font-medium">Task Description</label>
            <Input
              placeholder="e.g. Pages 1–10 or Section A"
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Instructions / Notes</label>
            <Textarea
              placeholder="Write notes for the employee..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Assign to Employees</label>
            <div className="space-y-2">
              {dummyEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedEmployees.includes(emp.id)}
                    onCheckedChange={() => toggleEmployee(emp.id)}
                    id={`emp-${emp.id}`}
                  />
                  <label htmlFor={`emp-${emp.id}`}>{emp.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button
            disabled={!taskDetail || selectedEmployees.length === 0}
            onClick={handleSubmit}
            className="w-full"
          >
            Confirm Assignment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
