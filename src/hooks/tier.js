import { post, get } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export function useTierCreation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const creatTierMutation = useMutation({
    mutationFn: (payload) => post("/tier", payload),
    onSuccess: () => {
      toast.success("Tier selected successfully!");
      queryClient.invalidateQueries(["tier"]);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Error selecting the Tier", error);
      toast.error("Failed to select the tier");
    },
  });

  return {
    selectTier: creatTierMutation.mutate,
    isCreating: creatTierMutation.isLoading,
    isError: creatTierMutation.isError,
  };
}

export function useGetAllTier() {
  const {
    data: getalltier,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getalltier"],
    queryFn: () => get("/tier"),
    onError: (error) => {
      console.error("Error fetching tier:", error);
      toast.error("Failed to fetch tier");
    },
  });

  return {
    getalltier,
    isLoading,
    isError,
  };
}