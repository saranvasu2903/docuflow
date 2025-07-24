"use client";

import { useSelector } from "react-redux";
import { useState } from "react";

export function Dashboard() {
  const {
    userId,
    organizationId,
    email,
    fullName,
    role,
    imageUrl,
    tierid
  } = useSelector(state => state.user);

  // Sample data for tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q2 Financial Report", status: "In Progress", dueDate: "2023-06-30", assignedBy: "Manager" },
    { id: 2, title: "Update Client Contracts", status: "Pending", dueDate: "2023-07-05", assignedBy: "Admin" },
    { id: 3, title: "Archive Old Project Files", status: "Completed", dueDate: "2023-06-15", assignedBy: "Team Lead" }
  ]);

  // Sample document statistics
  const documentStats = {
    total: 1245,
    assigned: 42,
    pendingReview: 18,
    overdue: 5
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Document Management System</h1>
        <div className="flex items-center space-x-4">
          {imageUrl ? (
            <img src={imageUrl} alt={fullName} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {fullName ? fullName.charAt(0) : "U"}
            </div>
          )}
          <div>
            <p className="font-medium">{fullName}</p>
            <p className="text-sm text-gray-600 capitalize">{role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Documents</h3>
          <p className="text-3xl font-bold text-blue-600">{documentStats.total}</p>
          <p className="text-sm text-gray-500 mt-2">Across all categories</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Assigned to You</h3>
          <p className="text-3xl font-bold text-orange-500">{documentStats.assigned}</p>
          <p className="text-sm text-gray-500 mt-2">{documentStats.pendingReview} need review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Overdue Tasks</h3>
          <p className="text-3xl font-bold text-red-500">{documentStats.overdue}</p>
          <p className="text-sm text-gray-500 mt-2">Require immediate attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Tasks Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              New Task
            </button>
          </div>
          
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600">Assigned by: {task.assignedBy}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === "Completed" ? "bg-green-100 text-green-800" :
                    task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm mt-1">Due: {task.dueDate}</p>
                <div className="flex space-x-2 mt-2">
                  <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                    View Details
                  </button>
                  <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">John Doe</span> assigned you a new document</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm">You completed <span className="font-medium">Annual Report 2023</span></p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">Client Contract.pdf</span> is due tomorrow</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm">Upload Document</span>
          </button>
          <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm">Assign Task</span>
          </button>
          <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-sm">Search Documents</span>
          </button>
          <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}