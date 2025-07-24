import { post,get } from "@/utils/apiHelper";
import { useMutation, useQueryClient,useQuery  } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const organizationId = useSelector((state) => state.user.organizationId);
  console.log("organizationid ddddd", organizationId);
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Organization-Id": organizationId,
        },
      });
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      queryClient.invalidateQueries(["documents"]);
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      const message =
        error?.response?.data?.error || "Failed to upload document.";
      toast.error(message);
    },
  });

  return {
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isLoading,
    isError: uploadMutation.isError,
  };
}

export function useGetUploadedDocument() {
  const organizationId = useSelector((state) => state.user.organizationId);

  const query = useQuery({
    queryKey: ["uploadedDocuments"],
    queryFn: () => get("/documents"),
    enabled: !!organizationId,
    onError: (error) => {
      console.error("Error fetching uploaded documents:", error);
      toast.error("Failed to fetch uploaded documents.");
    },
  });

  return {
    documents: query.data || [],
    isLoading: query.isFetching,
    isError: query.isError,
  };
}