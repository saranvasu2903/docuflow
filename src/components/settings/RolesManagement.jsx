"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetRoles } from "@/hooks/role";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCreateRole } from "@/hooks/role";
import toast from "react-hot-toast";
import RoleTable from "../roles/RoleTable";
import CreateRoleDrawer from "../roles/CreateRoleDrawer";
import ViewRoleDrawer from "../roles/ViewRoleDrawer";
import EditRoleDrawer from "../roles/EditRoleDrawer";

const RolesManagement = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: rolesData, isLoading, isError } = useGetRoles();
  const createRoleMutation = useCreateRole();

  const staticModules = [
    "settings",
    "projects",
    "documents",
    "teamlead-task",
    "employee-task",
    "approved-task",
    "todo-list",
    "events",
  ];
  const staticPermissions = ["view", "add", "edit", "delete"];

  const handleCreateRole = (newRole) => {
    createRoleMutation.mutate(newRole, {
      onSuccess: () => {
        toast.success("Role created successfully!");
        setIsCreateDrawerOpen(false);
      },
      onError: (error) => {
        console.error("Error creating role:", error);
      },
    });
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setIsViewDrawerOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsEditDrawerOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: selectedRole.id,
      roleName: selectedRole.roleName,
      organization_id: selectedRole.organization_id,
      permissions: Object.entries(selectedRole.permissions)
        .filter(([_, perms]) => perms.length > 0)
        .map(([module, perms]) => ({ module, actions: perms })),
    };
    console.log("Edit payload:", payload);
    setIsEditDrawerOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load roles. Please try again.
      </div>
    );
  }

  const roles = rolesData?.data || [];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage roles and permissions
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#fe4f02] hover:bg-[#cc3f01]"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      <RoleTable roles={roles} onViewRole={handleViewRole} onEditRole={handleEditRole} />

      <Sheet open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <SheetContent side="right" className="custom-drawer-content p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">
              Create New Role
            </SheetTitle>
          </SheetHeader>
          <CreateRoleDrawer
            onCreate={handleCreateRole}
            modules={staticModules}
            permissions={staticPermissions}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
        <SheetContent side="right" className="custom-drawer-content p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">
              View Role: {selectedRole?.roleName}
            </SheetTitle>
          </SheetHeader>
          <ViewRoleDrawer
            role={selectedRole}
            modules={staticModules}
            permissions={staticPermissions}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <SheetContent side="right" className="custom-drawer-content p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">
              Edit Role: {selectedRole?.roleName}
            </SheetTitle>
          </SheetHeader>
          <EditRoleDrawer
            role={selectedRole}
            modules={staticModules}
            permissions={staticPermissions}
            onSubmit={handleEditSubmit}
            setSelectedRole={setSelectedRole}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RolesManagement;