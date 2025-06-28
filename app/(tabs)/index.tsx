import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import useFetch from "@/services/usefetch";
import { fetchMovies, fetchTVSeries } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import TVSeriesCard from "@/components/TVSeriesCard";

const Index = () => {
  const router = useRouter();

  // Fetch trending movies
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // Fetch latest movies
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // Fetch latest TV series
  const {
    data: tvSeries,
    loading: tvSeriesLoading,
    error: tvSeriesError,
  } = useFetch(() => fetchTVSeries({ query: "" }));

  // Combine loading & error states for convenience
  const isLoading = trendingLoading || moviesLoading || tvSeriesLoading;
  const errorMessage = moviesError?.message || trendingError?.message || tvSeriesError?.message;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-20 h-16 mt-20 mb-5 mx-auto" />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : errorMessage ? (
          <Text className="text-center text-white mt-10">
            Error: {errorMessage}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie or TV series"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            {/* Latest Movies */}
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>
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

            {/* Latest TV Series */}
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest TV Series
            </Text>
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
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;


/* eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc


8a87996166f7f6209fcbfdd585f5a453

eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc */