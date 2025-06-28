import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import useFetch from "@/services/usefetch";
import {
  fetchMoviesByFilter,
} from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

const categories = [
  { label: "All", filter: {} },
  { label: "Horror", filter: { genreId: 27 } },
  { label: "Romance", filter: { genreId: 10749 } },
  { label: "Comedy", filter: { genreId: 35 } },
  { label: "Indian", filter: { language: "hi", region: "IN" } },
  { label: "Anime", filter: { genreId: 16, language: "ja" }, color: "bg-purple-600" },
  { label: "Action", filter: { genreId: 28 }, color: "bg-teal-600" },
  { label: "Adventure", filter: { genreId: 12 }, color: "bg-green-600" },
  { label: "Crime", filter: { genreId: 80 }, color: "bg-gray-700" },
  { label: "History", filter: { genreId: 36 }, color: "bg-amber-700" },
  { label: "SF", filter: { genreId: 878 }, color: "bg-indigo-600" },
    { label: "Animetion", filter: { genreId: 16 }, color: "bg-purple-600" },
];

const Index = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMoviesByFilter(selectedCategory.filter);
        setMovies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredMovies();
  }, [selectedCategory]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-20 h-16 mt-20 mb-5 mx-auto" />

        <SearchBar
          onPress={() => {
            router.push("/search");
          }}
          placeholder="Search for a movie or TV series"
        />


        {trendingLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : trendingError ? (
          <Text className="text-center text-white mt-10">Error: {trendingError.message}</Text>
        ) : (
          trendingMovies && (
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={trendingMovies}
                contentContainerStyle={{ gap: 26 }}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>
          )
        )}


    <View className="bg-gradient-to-br from-gray-100 to-white py-3 rounded-xl mt-2 shadow-lg">
  <Text className="text-xl font-bold py-2 text-white">Filter movies by category</Text>

  {/* Category Filter Buttons */}
  <View className="flex-row flex-wrap gap-2 mt-5 justify-center">
    {categories.map((cat) => (
      <TouchableOpacity
        key={cat.label}
        className={`px-4 py-2 rounded-md w-28 items-center shadow-md ${
          selectedCategory.label === cat.label
            ? " bg-blue-500"
            : "bg-transparent text-white border-2 border-white"
            
        }`}
        onPress={() => setSelectedCategory(cat)}
        
      >
        <Text className="text-white font-semibold text-sm text-center">{cat.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
        {/* Movies by Category */}
        <Text className="text-lg text-white font-bold mt-5 mb-3">
          {selectedCategory.label} Movies
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-5" />
        ) : error ? (
          <Text className="text-white">Error: {error}</Text>
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="mt-2 pb-10"
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Index;


/* eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc


8a87996166f7f6209fcbfdd585f5a453

eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc */