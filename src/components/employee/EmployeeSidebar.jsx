import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetRoles } from "@/hooks/role";
import { da } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function EmployeeSidebar({
  sidebarOpen,
  sidebarRef,
  isAddMode,
  addForm,
  addErrors,
  editForm,
  editErrors,
  handleAddChange,
  handleEditChange,
  handleSubmit,
  setSidebarOpen,
  isCreating,
  isUpdating,
}) {
  const [rolenames, setRolename] = useState([]);
  const { data: rolesData, isLoading, isError } = useGetRoles();

  useEffect(() => {
    if (rolesData && Array.isArray(rolesData.data)) {
      setRolename(rolesData.data);
    }
  }, [rolesData]);

  console.log("data", rolesData);
  console.log("rolenames", rolenames);

  // Example transformation if needed:
  const roledropdown = rolenames.map((e) => ({
    label: e.roleName,
    value: e.id,
  }));
  console.log("rolenamess", roledropdown);

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="right" className="w-full custom-drawer-content">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800 mb-6">
            {isAddMode ? "Add Team Member" : "Edit Team Member"}
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ADD FORM */}
          {isAddMode ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullname"
                  value={addForm.fullname}
                  onChange={handleAddChange}
                  placeholder="Enter full name"
                  className={`w-full ${
                    addErrors.fullname ? "border-red-500" : ""
                  }`}
                />
                {addErrors.fullname && (
                  <p className="text-red-600 text-sm mt-1">
                    {addErrors.fullname}
                  </p>
                )}
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={addForm.email}
                  onChange={handleAddChange}
                  placeholder="Enter email"
                  className={`w-full ${
                    addErrors.email ? "border-red-500" : ""
                  }`}
                />
                {addErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{addErrors.email}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullname"
                  value={editForm.fullname}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                  className={`w-full ${
                    editErrors.fullname ? "border-red-500" : ""
                  }`}
                />
                {editErrors.fullname && (
                  <p className="text-red-600 text-sm mt-1">
                    {editErrors.fullname}
                  </p>
                )}
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    editErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Role</option>
                  {rolenames.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
                {editErrors.role && (
                  <p className="text-red-600 text-sm mt-1">{editErrors.role}</p>
                )}

                {editErrors.role && (
                  <p className="text-red-600 text-sm mt-1">{editErrors.role}</p>
                )}
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <Input
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  placeholder="Enter status"
                  className={`w-full ${
                    editErrors.status ? "border-red-500" : ""
                  }`}
                />
                {editErrors.status && (
                  <p className="text-red-600 text-sm mt-1">
                    {editErrors.status}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSidebarOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
              disabled={isAddMode ? isCreating : isUpdating}
            >
              {isAddMode
                ? isCreating
                  ? "Adding..."
                  : "Add Team Member"
                : isUpdating
                ? "Updating..."
                : "Update Team Member"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
