import { post, get, patch } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  const createTeamMemberMutation = useMutation({
    mutationFn: (payload) => post("/teammembers", payload),
    onSuccess: () => {
      toast.success("Team member added successfully!");
      queryClient.invalidateQueries(["teammembers"]);
    },
    onError: (error) => {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member.");
    },
  });

  return {
    createTeamMember: createTeamMemberMutation.mutate,
    isCreating: createTeamMemberMutation.isLoading,
    isError: createTeamMemberMutation.isError,
  };
}

export function useGetTeamMembers(organizationId) {
  const {
    data: teamMembers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teammembers", organizationId],
    queryFn: () => {
      if (!organizationId) throw new Error("Missing organizationId param");
      return get(`/teammembers/${organizationId}`);
    },
    enabled: !!organizationId,
    onError: (error) => {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members.");
    },
  });

  return {
    teamMembers,
    isLoading,
    isError,
  };
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();

  const updateTeamMemberMutation = useMutation({
    mutationFn: ({ id, fullname, role, status }) => {
      console.log("Calling PATCH API:", {
        url: `/api/teammembers/employee/${id}`,
        payload: { fullname, role, status },
      }); // Debug log
      if (!id || !fullname || !role || !status) {
        throw new Error("Missing required fields: id, fullname, role, or status");
      }
      return patch(`/teammembers/employee/${id}`, { fullname, role, status });
    },
    onSuccess: (data) => {
      console.log("Team member update success:", data); // Debug log
      // toast.success(data.message || "Employee Details updated!");
      queryClient.invalidateQueries(["teammembers"]);
    },
    onError: (error) => {
      console.error("Error updating team member:", error); // Debug log
      const message = error?.response?.data?.error || "Failed to update team member.";
      toast.error(message);
    },
  });

  return {
    updateTeamMember: updateTeamMemberMutation.mutate,
    isUpdating: updateTeamMemberMutation.isPending, // Use isPending for consistency with modern react-query
    isError: updateTeamMemberMutation.isError,
  };
}