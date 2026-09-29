import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/api/users';

export const USER_KEYS = {
  all: ['users'] as const,
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn: userService.getAll,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.unlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
};
