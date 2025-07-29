import { get, post, put } from "@/utils/apiHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateRole() {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      return await post("/role", payload);
    },
    onSuccess: () => {
      //   toast.success("Role created successfully!");
    },
    onError: (error) => {
      console.error("Error creating role:", error);
      toast.error(error.message || "Failed to create role.");
    },
  });
  return mutation;
}

export function useGetRoles() {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      return await get("/role");
    },
    onError: (error) => {
      console.error("Error fetching roles:", error);
      toast.error(error.message || "Failed to fetch roles.");
    },
  });

  return query;
}

export function useUpdateRolePermissions() {
  const mutation = useMutation({
    mutationFn: ({ roleId, payload }) => {
      if (!roleId) throw new Error("Missing roleId");
      return put(`/role/update/${roleId}`, payload);
    },
    onSuccess: () => {
      toast.success("Role permissions updated successfully.");
    },
    onError: (error) => {
      console.error("Error updating role permissions:", error);
      //   toast.error(error?.message || "Failed to update role permissions.");
    },
  });

  return mutation;
}

export function useGetEmployeeRoles() {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      return await get("/role/employee-role");
    },
    onError: (error) => {
      console.error("Error fetching roles:", error);
      toast.error(error.message || "Failed to fetch roles.");
    },
  });

  return query;
}
