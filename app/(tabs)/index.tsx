import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";

import useFetch from "@/services/usefetch";
import { fetchMoviesByFilter, fetchMovieGenres, fetchTVSeriesByFilter } from "@/services/api"; // Updated import
import { getTrendingMovies } from "@/services/appwrite";
import { FilterParams, Movie, TVSeries } from "@/types/types";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TVSeriesCard from "@/components/TVSeriesCard";
import TrendingCard from "@/components/TrendingCard";

interface Category {
  label: string;
  filter: FilterParams;
  color: string;
}

const movieCategories: Category[] = [
  { label: "All", filter: {}, color: "bg-blue-600" },
  { label: "Horror", filter: { genreId: 27 }, color: "bg-red-600" },
  { label: "Romance", filter: { genreId: 10749 }, color: "bg-pink-500" },
  { label: "Comedy", filter: { genreId: 35 }, color: "bg-yellow-500" },
  { label: "Indian", filter: { language: "hi", region: "IN" }, color: "bg-orange-500" },
  { label: "Animation", filter: { genreId: 16 }, color: "bg-purple-500" },
  { label: "Anime", filter: { genreId: 16, language: "ja" }, color: "bg-purple-600" },
  { label: "Action", filter: { genreId: 28 }, color: "bg-teal-600" },
  { label: "Adventure", filter: { genreId: 12 }, color: "bg-green-600" },
  { label: "Crime", filter: { genreId: 80 }, color: "bg-gray-700" },
  { label: "History", filter: { genreId: 36 }, color: "bg-amber-700" },
  { label: "Sci-Fi", filter: { genreId: 878 }, color: "bg-indigo-600" },
];

const tvCategories: Category[] = [
  { label: "All", filter: {}, color: "bg-blue-600" },
  { label: "Drama", filter: { genreId: 18 }, color: "bg-red-600" },
  { label: "Comedy", filter: { genreId: 35 }, color: "bg-yellow-500" },
  { label: "Action", filter: { genreId: 10759 }, color: "bg-teal-600" },
  { label: "Sci-Fi", filter: { genreId: 10765 }, color: "bg-indigo-600" },
  { label: "Animation", filter: { genreId: 16 }, color: "bg-purple-500" },
   { label: "Crime", filter: { genreId: 80 }, color: "bg-gray-700" },
    { label: "Romance", filter: { genreId: 10749 }, color: "bg-pink-500" },
   { label: "K-drama", filter: { genreId: 18, originCountry: "KR" }, color: "bg-pink-600" },
];

const Index = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(movieCategories[0]);
  const [contentType, setContentType] = useState<"Movies" | "TV Series">("Movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvSeries, setTVSeries] = useState<TVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (contentType === "Movies") {
          const data = await fetchMoviesByFilter(selectedCategory.filter);
          setMovies(data);
          setTVSeries([]); // Clear TV series when switching to Movies
        } else {
          const data = await fetchTVSeriesByFilter(selectedCategory.filter); // Use new function
          setTVSeries(data);
          setMovies([]); // Clear movies when switching to TV Series
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 300 : 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedCategory, contentType, isExpanded]);

  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(getTrendingMovies);
  const { data: movieGenres, loading: genresLoading } = useFetch(fetchMovieGenres);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const categories = contentType === "Movies" ? movieCategories : tvCategories;

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
          onPress={() => router.push("/search")}
          placeholder="Search for a movie or TV series"
        />

        {trendingLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : trendingError ? (
          <Text className="text-center text-white mt-10">Error: {trendingError.message}</Text>
        ) : (
          trendingMovies && (
            <View className="mt-10">
              <Text className="text-xl text-white font-bold mb-3">Trending Movies</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={trendingMovies}
                contentContainerStyle={{ gap: 26 }}
                renderItem={({ item, index }) => <TrendingCard movie={item} index={index} />}
                keyExtractor={(item) => item.movie_id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>
          )
        )}

        <View className="bg-white rounded-xl mt-2 shadow-lg overflow-hidden">
          <TouchableOpacity
            className="py-2 px-3 flex-row justify-between items-center"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text className="text-xl font-bold text-black">Filters</Text>
           
            <Animated.View
              style={{
                transform: [{ rotate: rotateInterpolate }],
              }}
            >
              
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </Animated.View>
          </TouchableOpacity>
           
          <Animated.View style={{ height: heightAnim }}>
            <Text className="text-xl font-bold text-black text-center mt-2 mb-1">Content Type</Text>
            <View className="px-3 pt-2 pb-3">
              {/* Content Type Buttons */}
              <View className="flex-row justify-center gap-4 mb-5">
                <TouchableOpacity
                  className={`px-4 py-2 rounded-md w-28 items-center shadow-md ${
                    contentType === "Movies" ? "bg-blue-500" : "bg-black"
                  }`}
                  onPress={() => {
                    setContentType("Movies");
                    setSelectedCategory(movieCategories[0]);
                  }}
                >
                  <Text className="text-white font-semibold text-sm text-center">Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-2 rounded-md w-28 items-center shadow-md ${
                    contentType === "TV Series" ? "bg-blue-500" : "bg-black"
                  }`}
                  onPress={() => {
                    setContentType("TV Series");
                    setSelectedCategory(tvCategories[0]);
                  }}
                >
                  <Text className="text-white font-semibold text-sm text-center">TV Series</Text>
                </TouchableOpacity>
              </View>
              {/* Category Filter Buttons */}
              <Text className="text-xl font-bold text-black text-center mt-2 mb-2">Geners</Text>
              <View className="flex-row flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.label}
                    className={`px-4 py-2 rounded-md w-28 items-center shadow-md ${
                      selectedCategory.label === cat.label
                        ? "bg-blue-500"
                        : "bg-black"
                    }`}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text className="text-white font-semibold text-sm text-center">
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Content Display */}
        <Text className="text-xl text-white font-bold mt-6 mb-3">
          {selectedCategory.label} {contentType}
        </Text>

        {loading || genresLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-5" />
        ) : error ? (
          <Text className="text-white">Error: {error}</Text>
        ) : contentType === "Movies" ? (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} genres={movieGenres ?? []} />}
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
        ) : (
          <FlatList
            data={tvSeries}
            renderItem={({ item }) => <TVSeriesCard {...item} />}
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