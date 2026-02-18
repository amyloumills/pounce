// Cat Image from The Cat API
export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
  created_at?: string;
  original_filename?: string;
  breed_ids?: string[];
  sub_id?: string;
}

// Favourite entity
export interface Favourite {
  id: number;
  user_id: string;
  image_id: string;
  sub_id: string;
  created_at: string;
  image?: CatImage;
}

// Vote entity
export interface Vote {
  id: number;
  image_id: string;
  sub_id: string;
  created_at: string;
  value: 1 | -1; // 1 for upvote, -1 for downvote
  country_code?: string;
}

type VoteValue = 1 | -1 | 0; // 1 for upvote, -1 for downvote, 0 for no vote

// Enriched cat with aggregated data
export interface EnrichedCat extends CatImage {
  score: number;
  isFavourite: boolean;
  favouriteId?: number;
  userVote?: VoteValue;
}
