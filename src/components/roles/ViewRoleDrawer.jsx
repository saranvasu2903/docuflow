import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ViewRoleDrawer = ({ role, modules, permissions }) => {
  const rolePermissions = modules.reduce((acc, module) => {
    const perm = role?.permissions.find((p) => p.module === module);
    return { ...acc, [module]: perm ? perm.actions : [] };
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <p className="mt-1">{role?.roleName || "—"}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
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
                    {rolePermissions[module].includes(perm) ? "✓" : "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewRoleDrawer;