import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useGetProjectById, useGetusers, useUpdateProject } from '@/hooks/projects';
import LoadingSpinner from '../LoadingSpinner';

const EditProjectDrawer = React.memo(({ isOpen, onClose, project }) => {
  const { user } = useUser();
  const { organizationId } = useSelector((state) => state.user);
  const { projects: users, isLoading: usersLoading, isError: usersError } = useGetusers(organizationId);
  const { project: editProject, isLoading: editLoading, isError: editError } = useGetProjectById(project?.id);
  const { updateProject, isUpdating } = useUpdateProject();

  const [editForm, setEditForm] = useState({ name: '', description: '', start_date: '', end_date: '' });
  const [editErrors, setEditErrors] = useState({ name: '', description: '', start_date: '', end_date: '' });
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
        disabled={isUpdating}
      />
    ),
    name: user.fullName || user.email,
    email: user.email,
  })) || [];

  useEffect(() => {
    if (editProject && isOpen) {
      setEditForm({
        name: editProject.name || '',
        description: editProject.description || '',
        start_date: editProject.start_date ? new Date(editProject.start_date).toISOString().split('T')[0] : '',
        end_date: editProject.end_date ? new Date(editProject.end_date).toISOString().split('T')[0] : '',
      });
      const initialSelectedUsers = new Set(editProject.project_members.map((member) => member.user_id));
      setSelectedUsers(initialSelectedUsers);
    }
  }, [editProject, isOpen]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: '' }));
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
      name: !editForm.name.trim() ? 'Project name is required' : '',
      description: !editForm.description.trim() ? 'Description is required' : '',
      start_date: !editForm.start_date ? 'Start date is required' : '',
      end_date: !editForm.end_date ? 'End date is required' : '',
    };
    setEditErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    setIsSubmitDisabled(true);
    const payload = {
      id: project.id,
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      start_date: editForm.start_date,
      end_date: editForm.end_date,
      org_id: organizationId,
      project_members: Array.from(selectedUsers).map((userId) => ({
        user_id: userId,
        role_in_project: 'member',
      })),
    };
    console.log(payload, "payload for update");

    updateProject(payload, {
      onSuccess: () => {
        setEditForm({ name: '', description: '', start_date: '', end_date: '' });
        setSelectedUsers(new Set());
        setIsSubmitDisabled(false);
        onClose();
      },
      onError: (error) => {
        setIsSubmitDisabled(false);
      },
    });
  };

  if (usersLoading || editLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError || editError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load users or project. Please try again.
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="custom-drawer-content p-6 overflow-y-auto border-l border-gray-200">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">Edit Project</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Enter project name"
                className={`w-full ${editErrors.name ? 'border-red-500' : ''}`}
                disabled={isUpdating}
              />
              {editErrors.name && <p className="text-red-600 text-sm mt-1">{editErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="start_date"
                  type="date"
                  value={editForm.start_date}
                  onChange={handleEditChange}
                  className={`w-full ${editErrors.start_date ? 'border-red-500' : ''}`}
                  disabled={isUpdating}
                />
                {editErrors.start_date && <p className="text-red-600 text-sm mt-1">{editErrors.start_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="end_date"
                  type="date"
                  value={editForm.end_date}
                  onChange={handleEditChange}
                  className={`w-full ${editErrors.end_date ? 'border-red-500' : ''}`}
                  disabled={isUpdating}
                />
                {editErrors.end_date && <p className="text-red-600 text-sm mt-1">{editErrors.end_date}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Enter description"
                className={`w-full ${editErrors.description ? 'border-red-500' : ''}`}
                disabled={isUpdating}
              />
              {editErrors.description && <p className="text-red-600 text-sm mt-1">{editErrors.description}</p>}
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
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
              disabled={isUpdating || isSubmitDisabled}
            >
              {isUpdating ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
});

export default EditProjectDrawer;