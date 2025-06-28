export interface Movie {
  id: number;
  poster_path: string | null;
  title: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

export interface TVSeries {
  id: number;
  poster_path: string | null;
  name: string;
  vote_average: number;
  first_air_date: string;
  genre_ids?: number[];
}

export interface FilterParams {
  query?: string;
  genreId?: number;
  region?: string;
  language?: string;
  year?: number;
}