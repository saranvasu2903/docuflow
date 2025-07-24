import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { get, post } from '@/utils/apiHelper';

export const useSyncUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef(null);
  const syncUserMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user available');
      try {
        await get(`/users/${user.id}`);
        return { synced: false };
      } catch {
        const response = await post('/clerk/syncuser', { user });
        return { synced: true, response };
      }
    },
    onSuccess: (data) => {
      if (data?.synced) {
        queryClient.invalidateQueries(['userData', user?.id]);
      }
    },
    onError: (error) => {
      console.error('Error syncing user:', error);
    },
  });

  return {
    isSyncing: syncUserMutation.isLoading,
    isError: syncUserMutation.isError,
    error: syncUserMutation.error,
  };
};
