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
        old?.map((cat) => {
          if (cat.id !== imageId) return cat;

          if (cat.userVote === value) return cat;

          let newScore = cat.score;

          if (cat.userVote && cat.userVote !== value) {
            newScore += value * 2;
          } else {
            newScore += value;
          }

          return {
            ...cat,
            score: newScore,
            userVote: value,
          };
        })
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
    onError: (error, imageId, context) => {
      queryClient.setQueryData(['cats'], context?.previousCats);
      console.error('Failed to add favourite cat, id ', imageId, error);
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
    onError: (error, favouriteId, context) => {
      queryClient.setQueryData(['cats'], context?.previousCats);
      console.error('Failed to remove favourite cat, id ', favouriteId, error);
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
