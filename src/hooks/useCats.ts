import { useQuery } from '@tanstack/react-query';
import { catApi } from '../api/client';
import { CatImage, Vote, Favourite, EnrichedCat } from '../types/cat';

export const useCats = () => {
  return useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const [imagesRes, votesRes, favsRes] = await Promise.all([
        catApi.get<CatImage[]>('/images/search?limit=20&order=DESC'),
        catApi.get<Vote[]>('/votes'),
        catApi.get<Favourite[]>('/favourites'),
      ]);

      const images = imagesRes.data;
      const allVotes = votesRes.data;
      const allFavs = favsRes.data;

      return images.map((img): EnrichedCat => {
        // Calculate total for image
        const score = allVotes
          .filter((v) => v.image_id === img.id)
          .reduce((acc, curr) => acc + curr.value, 0);

        // Check if image is in favourites
        const fav = allFavs.find((f) => f.image_id === img.id);

        return {
          ...img,
          score,
          isFavourite: !!fav,
          favouriteId: fav?.id,
        };
      });
    },
  });
};
