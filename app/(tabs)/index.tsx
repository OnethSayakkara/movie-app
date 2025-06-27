
import { SafeAreaView } from "react-native-safe-area-context";
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
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";


export default function Index() {
     const router = useRouter();

       const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <SafeAreaView className="flex-1 bg-primary relative">
      {/* Background image */}
      <Image source={images.bg} className="absolute w-full h-full z-0" resizeMode="cover" />

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
      >
        {/* Logo */}
        <Image source={icons.logo} className="w-12 h-10 mt-8 mb-5 self-center" resizeMode="contain" />

         {moviesLoading  ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError ? (
          <Text>Error: {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            <>
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
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc


8a87996166f7f6209fcbfdd585f5a453

eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTg3OTk2MTY2ZjdmNjIwOWZjYmZkZDU4NWY1YTQ1MyIsIm5iZiI6MTc1MTAzODkzMC43NTAwMDAyLCJzdWIiOiI2ODVlYmJkMmE4M2NjZDgxZjQ5MTUyYzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vKhG4lijqrJevueEefGbeViXfjGyFvWk2RODjYAUbPc */