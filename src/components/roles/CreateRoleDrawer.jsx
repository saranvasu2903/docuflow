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

const CreateRoleDrawer = ({ onCreate, modules, permissions }) => {
  const [roleName, setRoleName] = useState("");
  const [roleErrors, setRoleErrors] = useState({ name: "" });
  const [selectedPermissions, setSelectedPermissions] = useState(
    modules.reduce((acc, module) => ({ ...acc, [module]: [] }), {})
  );

  const handlePermissionChange = (module, permission) => {
    setSelectedPermissions((prev) => {
      const newPermissions = new Set(prev[module]);
      if (newPermissions.has(permission)) {
        newPermissions.delete(permission);
      } else {
        newPermissions.add(permission);
      }
      return { ...prev, [module]: Array.from(newPermissions) };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: !roleName.trim() ? "Role name is required" : "",
    };
    setRoleErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    const payload = {
      roleName: roleName.trim(),
      permissions: Object.entries(selectedPermissions)
        .filter(([_, perms]) => perms.length > 0)
        .map(([module, perms]) => ({ module, actions: perms })),
    };
    onCreate(payload);
    setRoleName("");
    setSelectedPermissions(
      modules.reduce((acc, module) => ({ ...acc, [module]: [] }), {})
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
                      checked={selectedPermissions[module].includes(perm)}
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
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
        >
          Create Role
        </Button>
      </div>
    </form>
  );
};

export default CreateRoleDrawer;