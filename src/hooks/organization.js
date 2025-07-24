import { post, get, patch } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Create organization
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createOrgMutation = useMutation({
    mutationFn: (payload) => post("/organization", payload),

    onSuccess: () => {
      toast.success("Vendor created successfully!");
      queryClient.invalidateQueries(["organizations"]);
      router.push("/subscription");
    },

    onError: (error) => {
      console.error("Error creating vendor:", error);
      // toast.error("Failed to create Vendor.");
       const message =
        error?.response?.data?.error || "Failed to create vendor.";
      toast.error(message);
    },
  });

  return {
    createOrganization: createOrgMutation.mutate,
    isCreating: createOrgMutation.isLoading,
    isError: createOrgMutation.isError,
  };
}

export function useGetOrganization(userId) {
  const query = useQuery({
    queryKey: ["organization", userId],
    queryFn: () => {
      if (!userId) throw new Error("Missing userId param");
      return get(`organization/${userId}`);
    },
    enabled: !!userId,
    onError: (error) => {
      console.error("Error fetching organization:", error);
      toast.error("Failed to fetch organization.");
    },
  });
  return {
    organization: query.data,
    isLoading: query.isFetching,
    isError: query.isError,
  };
}
// Update organization by createdby
export function useUpdateOrganization(createdby) {
  const queryClient = useQueryClient();

  const updateOrgMutation = useMutation({
    mutationFn: (payload) => patch(`/organization/${createdby}`, payload),

    onSuccess: () => {
      toast.success("Vendor updated successfully!");
      queryClient.invalidateQueries(["organization", createdby]);
    },

    onError: (error) => {
      console.error("Error updating vendor:", error);
      // toast.error("Failed to update vendor.");
      const message =
        error?.response?.data?.error || "Failed to update vendor.";
      toast.error(message);
    },
  });

  return {
    updateOrganization: updateOrgMutation.mutate,
    isUpdating: updateOrgMutation.isLoading,
    isError: updateOrgMutation.isError,
  };
}
