import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Pencil } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EmployeesTable({ teamMembers, isTeamLoading, isAdmin, onEdit, onAdd }) {
  if (isTeamLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!teamMembers?.length) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
          <Users className="h-5 w-5 text-gray-500" />
        </div>
        <h3 className="text-gray-900 text-sm font-medium">
          No team members
        </h3>
        <p className="text-gray-500 mt-1">
          Get started by adding a new team member
        </p>
        {isAdmin && (
          <Button
            onClick={onAdd}
            variant="outline"
            className="mt-4 bg-[#fe4f02] hover:bg-[#cc3f01] text-white"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Add Members
          </Button>
        )}
      </div>
    );
  }

  return (
    <Table className="min-w-full border rounded-xl overflow-hidden shadow-sm bg-white">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          {isAdmin && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamMembers.map((member) => (
          <TableRow key={member.id} className="hover:bg-muted/40 transition-colors">
            <TableCell>
              <div className="flex items-center gap-3">
                <img
                  src={
                    member.userDetails?.fulldata?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullname || "?")}&background=random`
                  }
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullname || "?")}&background=random`;
                  }}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border shadow-sm"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {member.fullname || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.userDetails?.fulldata?.primaryEmailAddress?.emailAddress || member.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.userDetails?.role || "—"}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.status?.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700"
                  : member.status?.toLowerCase() === "inactive"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : "—"}
              </span>
            </TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <Button variant="ghost" onClick={() => onEdit(member)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
