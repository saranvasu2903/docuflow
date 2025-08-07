"use client";

import React, { useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Plus, Pencil } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetProjectsByOrg } from "@/hooks/projects";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ProjectsTable = React.memo(({ onAdd, onEdit }) => {
  const { user, isLoaded } = useUser();
  const { organizationId } = useSelector((state) => ({
    organizationId: state.user.organizationId,
  }));
  const permission = useSelector((state) => state.user.permission);
  useEffect(() => {
    console.log("User Permissions from Redux:", permission);
  }, [permission]);

  const checkPermission = (permissions, module, action) => {
    const modulePermissions = permissions.find((p) => p.module === module);
    return modulePermissions?.actions.includes(action);
  };
  const projectPermissions = useMemo(() => {
    return {
      canAdd: checkPermission(permission, "projects", "add"),
      canEdit: checkPermission(permission, "projects", "edit"),
    };
  }, [permission]);
  const {
    projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsByOrg(organizationId, {
    enabled: !!organizationId && isLoaded,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!isLoaded || projectsLoading) {
    return <LoadingSpinner />;
  }

  if (projectsError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization's projects
          </p>
        </div>

        {projectPermissions.canAdd && (
          <Button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#fe4f02] hover:bg-[#cc3f01]"
          >
            <Plus className="w-4 h-4 " />
            Add Project
          </Button>
        )}
      </div>
      {!projects?.length ? (
        <div className="text-center border rounded-xl p-10 bg-muted/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Plus className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">
            No projects found
          </h3>
          <p className="text-muted-foreground mt-1">
            Get started by creating a new project.
          </p>

          {projectPermissions.canAdd && (
            <Button onClick={onAdd} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {new Date(project.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(project.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {project.project_members.map((member) => (
                      <Image
                        key={member.id}
                        src={
                          member.users.fulldata.imageUrl ||
                          "/fallback-avatar.png"
                        }
                        alt={member.users.fullName || member.users.email}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {projectPermissions.canEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
});

export default ProjectsTable;
