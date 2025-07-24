'use client'

import { useState } from 'react'
import AssignedTasksTable from '@/components/teamlead/AssignedTasksTable'
import AssignTaskDrawer from '@/components/teamlead/AssignTaskDrawer'

const page =() =>{
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentDoc, setCurrentDoc] = useState(null)

const assignedDocs = [
  {
    id: 'doc1',
    filename: 'Employee Policy.pdf',
    uploadedBy: 'Manager John',
    assignedDate: '2025-07-20',
    assignedTo: ['Emp A', 'Emp B'],
    note: 'Please focus on sections 3 & 4.',
  },
  {
    id: 'doc2',
    filename: 'Salary Report.xlsx',
    uploadedBy: 'Manager Lisa',
    assignedDate: '2025-07-18',
    assignedTo: ['Emp C'],
    note: '',
  },
]

  const openDrawer = (doc) => {
    setCurrentDoc(doc)
    setDrawerOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Assigned Documents</h2>

      <AssignedTasksTable documents={assignedDocs} onAssignClick={openDrawer} />

      <AssignTaskDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        document={currentDoc}
      />
    </div>
  )
}

export default page