import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreateProject, useGetusers } from '@/hooks/projects';
import LoadingSpinner from '../LoadingSpinner';

const AddProjectDrawer = React.memo(({ isOpen, onClose }) => {
  const { user } = useUser();
  const createdBy = user?.id;
  const { organizationId } = useSelector((state) => state.user);
  const { projects: users, isLoading: usersLoading, isError: usersError } = useGetusers(organizationId);
  const { createProject, isCreating } = useCreateProject();

  const [addForm, setAddForm] = useState({ name: '', description: '', start_date: '', end_date: '' });
  const [addErrors, setAddErrors] = useState({ name: '', description: '', start_date: '', end_date: '' });
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const columns = [
    { header: 'Select', accessor: 'select' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
  ];

  const tableData = users?.users?.map(user => ({
    select: (
      <input
        type="checkbox"
        checked={selectedUsers.has(user.id)}
        onChange={() => handleUserSelection(user.id)}
        disabled={isCreating}
      />
    ),
    name: user.fullName || user.email,
    email: user.email,
  })) || [];

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    setAddErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: !addForm.name.trim() ? 'Project name is required' : '',
      description: !addForm.description.trim() ? 'Description is required' : '',
      start_date: !addForm.start_date ? 'Start date is required' : '',
      end_date: !addForm.end_date ? 'End date is required' : '',
    };
    setAddErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    setIsSubmitDisabled(true);
    const payload = {
      name: addForm.name.trim(),
      description: addForm.description.trim(),
      createdby: createdBy,
      start_date: addForm.start_date,
      end_date: addForm.end_date,
      org_id: organizationId,
      project_members: Array.from(selectedUsers).map((userId) => ({
        user_id: userId,
        role_in_project: 'member',
      })),
    };

    createProject(payload, {
      onSuccess: () => {
        setAddForm({ name: '', description: '', start_date: '', end_date: '' });
        setSelectedUsers(new Set());
        setIsSubmitDisabled(false);
        onClose();
      },
      onError: (error) => {
        setIsSubmitDisabled(false);
      },
    });
  };

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="custom-drawer-content p-6 overflow-y-auto border-l border-gray-200">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">Add Project</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={addForm.name}
                onChange={handleAddChange}
                placeholder="Enter project name"
                className={`w-full ${addErrors.name ? 'border-red-500' : ''}`}
                disabled={isCreating}
              />
              {addErrors.name && <p className="text-red-600 text-sm mt-1">{addErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="start_date"
                  type="date"
                  value={addForm.start_date}
                  onChange={handleAddChange}
                  className={`w-full ${addErrors.start_date ? 'border-red-500' : ''}`}
                  disabled={isCreating}
                />
                {addErrors.start_date && <p className="text-red-600 text-sm mt-1">{addErrors.start_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="end_date"
                  type="date"
                  value={addForm.end_date}
                  onChange={handleAddChange}
                  className={`w-full ${addErrors.end_date ? 'border-red-500' : ''}`}
                  disabled={isCreating}
                />
                {addErrors.end_date && <p className="text-red-600 text-sm mt-1">{addErrors.end_date}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                name="description"
                value={addForm.description}
                onChange={handleAddChange}
                placeholder="Enter description"
                className={`w-full ${addErrors.description ? 'border-red-500' : ''}`}
                disabled={isCreating}
              />
              {addErrors.description && <p className="text-red-600 text-sm mt-1">{addErrors.description}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Users</label>
            <Table data={tableData} columns={columns} className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.accessor}
                      className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <TableCell key={column.accessor} className="px-4 py-2 whitespace-nowrap">
                        {row[column.accessor]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
              disabled={isCreating || isSubmitDisabled}
            >
              {isCreating ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
});

export default AddProjectDrawer;