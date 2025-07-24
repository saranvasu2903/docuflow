import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  isUpdating
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      } w-96 p-6 overflow-y-auto border-l border-gray-200`}
      ref={sidebarRef}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isAddMode ? "Add Team Member" : "Edit Team Member"}
      </h2>
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
                className={`w-full ${addErrors.fullname ? "border-red-500" : ""}`}
              />
              {addErrors.fullname && <p className="text-red-600 text-sm mt-1">{addErrors.fullname}</p>}
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
                className={`w-full ${addErrors.email ? "border-red-500" : ""}`}
              />
              {addErrors.email && <p className="text-red-600 text-sm mt-1">{addErrors.email}</p>}
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
                className={`w-full ${editErrors.fullname ? "border-red-500" : ""}`}
              />
              {editErrors.fullname && <p className="text-red-600 text-sm mt-1">{editErrors.fullname}</p>}
            </div>
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Input
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                placeholder="Enter role"
                className={`w-full ${editErrors.role ? "border-red-500" : ""}`}
              />
              {editErrors.role && <p className="text-red-600 text-sm mt-1">{editErrors.role}</p>}
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
                className={`w-full ${editErrors.status ? "border-red-500" : ""}`}
              />
              {editErrors.status && <p className="text-red-600 text-sm mt-1">{editErrors.status}</p>}
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => setSidebarOpen(false)}>
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
    </div>
  );
}
