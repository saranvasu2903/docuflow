import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateRolePermissions } from "@/hooks/role";

const EditRoleDrawer = ({
  role,
  modules,
  permissions,
  onSubmit,
  setSelectedRole,
  onClose,
}) => {
  const [roleName, setRoleName] = useState(role?.roleName || "");
  const [roleErrors, setRoleErrors] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState(
    modules.reduce((acc, module) => {
      const perm = role?.permissions.find((p) => p.module === module);
      return perm ? { ...acc, [module]: perm.actions } : acc;
    }, {})
  );

  const updateRolePermissions = useUpdateRolePermissions();

  const handlePermissionChange = (module, permission) => {
    setSelectedPermissions((prev) => {
      const currentPermissions = new Set(prev[module] || []);
      if (currentPermissions.has(permission)) {
        currentPermissions.delete(permission);
      } else {
        currentPermissions.add(permission);
      }

      const updatedPermissions = Array.from(currentPermissions);
      if (updatedPermissions.length === 0) {
        // Remove module entirely if no permissions are left
        const { [module]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [module]: updatedPermissions };
    });
  };

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const newErrors = {
      name: !roleName.trim() ? "Role name is required" : "",
    };
    setRoleErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      console.error("Form validation failed:", newErrors);
      return;
    }

    const payload = {
      roleName: roleName.trim(),
      permissions: Object.entries(selectedPermissions)
        .filter(([_, perms]) => perms.length > 0)
        .map(([module, perms]) => ({ module, actions: perms })),
    };

    console.log("Submitting role data:", { roleId: role.id, payload });
    setIsSubmitting(true);

    updateRolePermissions.mutate(
      { roleId: role.id, payload },
      {
        onSuccess: () => {
          const updatedRole = { ...role, ...payload };
          setSelectedRole(updatedRole);
          onSubmit(updatedRole);
          onClose();
        },
        onError: (err) => {
          console.error("Mutation error:", err);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={roleName}
          onChange={(e) => {
            setRoleName(e.target.value);
            setRoleErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Enter role name"
          className={`w-full ${roleErrors.name ? "border-red-500" : ""}`}
        />
        {roleErrors.name && (
          <p className="text-red-600 text-sm mt-1">{roleErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Permissions
        </label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              {permissions.map((perm) => (
                <TableHead key={perm} className="text-center">
                  {perm}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module}>
                <TableCell className="font-medium">{module}</TableCell>
                {permissions.map((perm) => (
                  <TableCell key={perm} className="text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedPermissions[module]?.includes(perm) || false
                      }
                      onChange={() => handlePermissionChange(module, perm)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default EditRoleDrawer;
