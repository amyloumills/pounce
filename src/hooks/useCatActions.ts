import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catApi } from '../api/client';
import { EnrichedCat } from '../types/cat';

export const useCatActions = () => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({ imageId, value }: { imageId: string; value: 1 | -1 }) => {
      const { data } = await catApi.post('/votes', { image_id: imageId, value });
      return data;
    },
    onMutate: async ({ imageId, value }) => {
      await queryClient.cancelQueries({ queryKey: ['cats'] });

      const previousCats = queryClient.getQueryData<EnrichedCat[]>(['cats']);

      queryClient.setQueryData<EnrichedCat[]>(['cats'], (old) =>
        old?.map((cat) => (cat.id === imageId ? { ...cat, score: cat.score + value } : cat))
      );

      return { previousCats };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['cats'], context?.previousCats);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cats'] });
    },
  });

  const favouriteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { data } = await catApi.post('/favourites', { image_id: imageId });
      return data;
    },
    onMutate: async (imageId) => {
      await queryClient.cancelQueries({ queryKey: ['cats'] });
      const previousCats = queryClient.getQueryData<EnrichedCat[]>(['cats']);
      queryClient.setQueryData<EnrichedCat[]>(['cats'], (old) =>
        old?.map((cat) => (cat.id === imageId ? { ...cat, isFavourite: true } : cat))
      );
      return { previousCats };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['cats'], context?.previousCats);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cats'] });
    },
  });

  const deleteFavouriteMutation = useMutation({
    mutationFn: async (favouriteId: number) => {
      const { data } = await catApi.delete(`/favourites/${favouriteId}`);
      return data;
    },
    onMutate: async (favouriteId) => {
      await queryClient.cancelQueries({ queryKey: ['cats'] });
      const previousCats = queryClient.getQueryData<EnrichedCat[]>(['cats']);

      queryClient.setQueryData<EnrichedCat[]>(['cats'], (old) =>
        old?.map((cat) => (cat.favouriteId === favouriteId ? { ...cat, isFavourite: false } : cat))
      );
      return { previousCats };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['cats'], context?.previousCats);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cats'] });
    },
  });

  return {
    vote: voteMutation.mutate,
    favourite: favouriteMutation.mutate,
    unfavourite: deleteFavouriteMutation.mutate,
    isPending:
      voteMutation.isPending || favouriteMutation.isPending || deleteFavouriteMutation.isPending,
  };
};
