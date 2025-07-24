import { useState } from 'react'
import ViewTaskDrawer from './ViewTaskDrawer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
export default function AssignedTasksTable({ documents, onAssignClick }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openView = (task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  return (
    <>
      <div className="rounded-xl border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date Assigned</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.filename}</TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>{doc.assignedDate}</TableCell>
                <TableCell>
                  {doc.assignedTo?.length
                    ? doc.assignedTo.join(', ')
                    : '—'}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => onAssignClick(doc)}>
                    Assign
                  </Button>
                  <Button size="sm" onClick={() => openView(doc)}>
                    View Task
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewTaskDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        task={selectedTask}
      />
    </>
  )
}
