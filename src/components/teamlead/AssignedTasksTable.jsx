import { useState } from "react";
import ViewTaskDrawer from "./ViewTaskDrawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useGetTeamleadTasks } from "@/hooks/teamlead"; 

export default function AssignedTasksTable({ onAssignClick }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { userId } = useSelector((state) => state.user);

  const { data, isLoading, isError } = useGetTeamleadTasks(userId);
  console.log("datasssssssssss", data);

  const openView = (task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Document Files Count</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5}>Error loading tasks</TableCell>
              </TableRow>
            ) : data?.data?.length ? (
              data.data.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.projectname || "—"}</TableCell>
                  <TableCell>
                    {doc.duedate ? new Date(doc.duedate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>{doc.uploadedUser?.fullname || "—"}</TableCell>
                  <TableCell>{doc.files?.length || 0}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAssignClick(doc)}
                    >
                      Assign
                    </Button>
                    <Button size="sm" onClick={() => openView(doc)}>
                      View Task
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No tasks found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ViewTaskDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        task={selectedTask}
      />
    </>
  );
}