import { post, get, put  } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useGetusers(orgId) {
  const query = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => {
      if (!orgId) throw new Error("Missing orgId param");
      return get(`/users/employee/${orgId}`);
    },
    enabled: !!orgId,
    onError: (error) => {
      console.error("Error fetching users :", error);
      toast.error("Failed to fetch users.");
    },
  });

  return {
    projects: query.data,
    isLoading: query.isFetching,
    isError: query.isError,
  };
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createProjectMutation = useMutation({
    mutationFn: (payload) => post("/project", payload),

    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries(["projects"]);
      router.push("/projects");
    },

    onError: (error) => {
      console.error("Error creating project:", error);
      const message =
        error?.response?.data?.error || "Failed to create project.";
      toast.error(message);
    },
  });

  return {
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isLoading,
    isError: createProjectMutation.isError,
  };
}

export function useGetProjectsByOrg(orgId) {
  const query = useQuery({
    queryKey: ["projectsByOrg", orgId],
    queryFn: () => {
      if (!orgId) throw new Error("Missing orgId param");
      return get(`/project/org/${orgId}`);
    },
    enabled: !!orgId,
    onError: (error) => {
      console.error("Error fetching projects by org:", error);
      toast.error("Failed to fetch projects.");
    },
  });

  return {
    projects: query.data?.projects || [],
    isLoading: query.isFetching,
    isError: query.isError,
  };
}

export function useGetProjectById(projectId) {
  const query = useQuery({
    queryKey: ["projectById", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Missing projectId param");
      return get(`/project/${projectId}`);
    },
    enabled: !!projectId,
    onError: (error) => {
      console.error("Error fetching project by ID:", error);
      toast.error("Failed to fetch project details.");
    },
  });

  return {
    project: query.data?.project || null,
    isLoading: query.isFetching,
    isError: query.isError,
  };
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, ...payload }) => put(`/project/${id}`, payload),

    onSuccess: (res, { id }) => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries(["projectById", id]);
    },

    onError: (error) => {
      console.error("Error updating project:", error);
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update project.";
      toast.error(message);
    },
  });

  return {
    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isLoading,
    isError: updateProjectMutation.isError,
  };
}
