import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmployeesHeader({ isAdmin, onAdd }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Our Employees</h1>
        <p className="text-gray-500 mt-1">
          Manage your organization's Employees
        </p>
      </div>
      {isAdmin && (
        <Button
          onClick={onAdd}
          variant="outline"
          className="bg-[#fe4f02] hover:bg-[#cc3f01] text-white hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      )}
    </div>
  );
}
