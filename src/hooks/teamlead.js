import { get } from "@/utils/apiHelper";
import { useQuery } from "@tanstack/react-query";

export function useGetTeamleadTasks(userId) {
  const query = useQuery({
    queryKey: ["teamleadTasks", userId],
    queryFn: () => {
      if (!userId) throw new Error("Missing userId param");
      return get(`/teamlead-task/${userId}`);
    },
    enabled: !!userId,
    onError: (error) => {
      console.error("Error fetching teamlead tasks:", error);
      toast.error("Failed to fetch teamlead task list.");
    },
  });

  return query;
}