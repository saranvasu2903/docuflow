'use client'

import { useState } from 'react'
import EmployeeTasksTable from '@/components/employeetask/EmployeeTasksTable'
import UploadWorkDrawer from '@/components/employeetask/UploadWorkDrawer'

const  page=() =>{
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTask, setActiveTask] = useState(null)

  // ─── Dummy tasks assigned to this employee ───
  const [tasks, setTasks] = useState([
    {
      id: 't1',
      projectName: 'Employee Policy.pdf',
      status: 'Pending',
      dueDate: '2025‑07‑25',
      attachment: '/docs/employee_policy.pdf',
      note: 'Focus on sections 3 & 4',
      submittedFile: null,
    },
    {
      id: 't2',
      projectName: 'Salary Report.xlsx',
      status: 'In Progress',
      dueDate: '2025‑07‑28',
      attachment: '/docs/salary_report.xlsx',
      note: '',
      submittedFile: null,
    },
  ])

  // opens drawer for upload
  const openUpload = (task) => {
    setActiveTask(task)
    setDrawerOpen(true)
  }

  // called after user “uploads” work
  const handleUploadComplete = (taskId, fileName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'Completed', submittedFile: fileName }
          : t,
      ),
    )
    setDrawerOpen(false)
  }

  // inline status toggle
  const updateStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <EmployeeTasksTable
        tasks={tasks}
        onUploadClick={openUpload}
        onStatusChange={updateStatus}
      />
      <UploadWorkDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        task={activeTask}
        onComplete={handleUploadComplete}
      />
    </div>
  )
}
export default page;