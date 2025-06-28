/* const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err)); */

  export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};





export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};


// api.ts
export const fetchMovieVideos = async (movieId: string) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie videos: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Video API Response for movieId ${movieId}:`, data.results);
    const video = (
      data.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube") ||
      data.results.find((video: any) => video.type === "Teaser" && video.site === "YouTube") ||
      data.results.find((video: any) => video.type === "Clip" && video.site === "YouTube") ||
      data.results.find((video: any) => video.site === "YouTube")
    );
    if (!video) {
      console.log(`No suitable video found for movieId ${movieId}`);
    }
    return video;
  } catch (error) {
    console.error(`Error fetching movie videos for movieId ${movieId}:`, error);
    throw error;
  }
};



// api.ts or services/api.ts

export const fetchTVSeries = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TV series: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchTVSeriesDetails = async (tvId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/tv/${tvId}?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch TV series details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};



export const fetchTVSeriesVideos = async (tvId: string) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch TV series videos: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data; // will have a "results" array with video info
  } catch (error) {
    console.error(`Error fetching TV series videos for id ${tvId}:`, error);
    throw error;
  }
};


export const fetchMovieGenres = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch movie genres: ${response.statusText}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw error;
  }
};

export const fetchTVSeriesGenres = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/genre/tv/list?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch TV series genres: ${response.statusText}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching TV series genres:", error);
    throw error;
  }
};


export const fetchMoviesByCategory = async (filter: {
  language?: string;
  region?: string;
  genreId?: number;
}): Promise<Movie[]> => {
  let url = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  if (filter.language) {
    url += `&with_original_language=${filter.language}`;
  }

  if (filter.region) {
    url += `&region=${filter.region}`;
  }

  if (filter.genreId) {
    url += `&with_genres=${filter.genreId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};


export const fetchMoviesByFilter = async ({
  language,
  region,
  genreId,
}: {
  language?: string;
  region?: string;
  genreId?: number;
}): Promise<Movie[]> => {
  const params = new URLSearchParams();

  if (language) params.append("with_original_language", language);
  if (region) params.append("region", region);
  if (genreId) params.append("with_genres", genreId.toString());
  params.append("sort_by", "popularity.desc");

  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?${params.toString()}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies by filter: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};
