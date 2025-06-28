import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { WebView } from 'react-native-webview';

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchMovieDetails, fetchMovieVideos } from "@/services/api";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailer, setTrailer] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
  const { data: videoData, error } = useFetch(() => fetchMovieVideos(id as string));

  useEffect(() => {
    if (videoData) {
      setTrailer(videoData);
      setErrorMessage(null);
    } else if (error) {
      setErrorMessage("Failed to load video data.");
    } else {
      setErrorMessage("No video available for this movie.");
    }
  }, [videoData, id, error]);

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  const handlePlayPress = () => {
    if (trailer) {
      setIsPlaying(true);
      setErrorMessage(null);
    } else {
      setErrorMessage("No trailer available.");
    }
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={handlePlayPress}
          >
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>

          {isPlaying && trailer && (
            <WebView
              style={{ width: "100%", height: 250, marginTop: 10 }}
              source={{ uri: `https://www.youtube.com/embed/${trailer.key}?controls=1&autoplay=1` }}
              javaScriptEnabled
              allowsInlineMediaPlayback
            />
          )}

          {errorMessage && (
            <Text className="text-light-200 mt-5 text-center">{errorMessage}</Text>
          )}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

    </View>
  );
};

export default Details;

Details.options = {
  headerShown: false,
  tabBarStyle: { display: "none" },
};
