import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catApi } from '../api/client';

export const useUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await catApi.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cats'] });
    },
  });
};
